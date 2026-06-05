import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isHoliday } from 'korean-holidays';
import {
  getCalendarDays,
  WEEKDAY_NAMES,
  addMonths,
  subMonths,
  isSameDay,
  format,
  getDeadlineUrgency,
  CalendarDay,
} from '../../../shared/lib/dateUtils';
import { ko } from 'date-fns/locale';
import { CreateDeadlineRequest, Deadline } from '../../../entities/deadline/model/types';
import { CalendarDayModal } from './CalendarDayModal';

interface CalendarProps {
  deadlines: Deadline[];
  onCreateDeadline: (data: CreateDeadlineRequest) => Promise<any>;
  onDeleteDeadline?: (id: string) => Promise<any>;
}

export function Calendar({ deadlines, onCreateDeadline, onDeleteDeadline }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);

  const days = useMemo(() => getCalendarDays(currentDate), [currentDate]);

  const goToPrev = () => setCurrentDate((d) => subMonths(d, 1));
  const goToNext = () => setCurrentDate((d) => addMonths(d, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getEventsForDay = (date: Date): Deadline[] => {
    return deadlines.filter((d) => isSameDay(new Date(d.dueDate), date));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowDayModal(true);
  };

  return (
    <>
      <CalendarContainer id="main-calendar">
        <CalendarHeader>
          <CalendarTitle>
            {format(currentDate, 'yyyy년 M월', { locale: ko })}
          </CalendarTitle>
          <CalendarNav>
            <TodayBtn onClick={goToToday}>오늘</TodayBtn>
            <NavBtn onClick={goToPrev} aria-label="이전 달"><ChevronLeft size={18} /></NavBtn>
            <NavBtn onClick={goToNext} aria-label="다음 달"><ChevronRight size={18} /></NavBtn>
          </CalendarNav>
        </CalendarHeader>

        <Weekdays>
          {WEEKDAY_NAMES.map((name, idx) => (
            <Weekday key={name} $isSunday={idx === 0} $isSaturday={idx === 6}>{name}</Weekday>
          ))}
        </Weekdays>

        <Grid>
          {days.map((day, idx) => {
            const events = getEventsForDay(day.date);
            const isSelected = selectedDate && isSameDay(day.date, selectedDate);
            const dayOfWeek = day.date.getDay();
            const isSunday = dayOfWeek === 0;
            const isSaturday = dayOfWeek === 6;
            const isHolidayDay = isHoliday(day.date) !== null;
            const isSundayOrHoliday = isSunday || isHolidayDay;

            return (
              <DayCell
                key={idx}
                $isCurrentMonth={day.isCurrentMonth}
                $isToday={day.isToday}
                $isSelected={!!isSelected}
                onClick={() => handleDayClick(day.date)}
              >
                <DayNumber 
                  $isToday={day.isToday}
                  $isSundayOrHoliday={isSundayOrHoliday}
                  $isSaturday={isSaturday}
                >
                  {day.date.getDate()}
                </DayNumber>
                <DayEvents>
                  {events.slice(0, 2).map((event) => {
                    const urgency = getDeadlineUrgency(event.dueDate);
                    return (
                      <EventDot key={event.id} $urgency={urgency} title={event.title}>
                        {event.title}
                      </EventDot>
                    );
                  })}
                  {events.length > 2 && (
                    <EventMore>+{events.length - 2}개 더</EventMore>
                  )}
                </DayEvents>
              </DayCell>
            );
          })}
        </Grid>
      </CalendarContainer>

      <CalendarDayModal
        isOpen={showDayModal}
        onClose={() => setShowDayModal(false)}
        date={selectedDate}
        events={selectedDate ? getEventsForDay(selectedDate) : []}
        onCreateDeadline={onCreateDeadline}
        onDeleteDeadline={onDeleteDeadline}
      />
    </>
  );
}

const CalendarContainer = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
`;

const CalendarTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
`;

const CalendarNav = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const TodayBtn = styled.button`
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-text-primary);
  }
`;

const NavBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-text-primary);
  }
`;

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: var(--space-1);
`;

const Weekday = styled.div<{ $isSunday?: boolean; $isSaturday?: boolean }>`
  text-align: center;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--space-2);
  color: ${(p) => 
    p.$isSunday ? 'var(--color-danger, #ef4444)' 
    : p.$isSaturday ? '#3b82f6' 
    : 'var(--color-text-tertiary)'};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

const DayCell = styled.div<{ $isCurrentMonth: boolean; $isToday: boolean; $isSelected: boolean }>`
  min-height: 80px;
  padding: var(--space-2);
  background: var(--color-bg-secondary);
  cursor: pointer;
  transition: background var(--transition-fast);
  opacity: ${(p) => (p.$isCurrentMonth ? 1 : 0.4)};
  border: ${(p) => (p.$isSelected ? '2px solid var(--color-accent-primary)' : '2px solid transparent')};

  &:hover {
    background: var(--color-surface-hover);
  }
`;

const DayNumber = styled.div<{ $isToday: boolean; $isSundayOrHoliday: boolean; $isSaturday: boolean }>`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-1);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);

  ${(p) =>
    p.$isToday
      ? `
    background: var(--color-accent-primary);
    color: #fff;
    font-weight: var(--font-weight-bold);
  `
      : p.$isSundayOrHoliday
      ? `
    color: var(--color-danger, #ef4444);
  `
      : p.$isSaturday
      ? `
    color: #3b82f6;
  `
      : `
    color: var(--color-text-primary);
  `}
`;

const DayEvents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const urgencyColors: Record<string, string> = {
  overdue: 'var(--color-danger, #ef4444)',
  urgent: '#f59e0b',
  warning: '#eab308',
  soon: '#3b82f6',
  normal: 'var(--color-accent-primary)',
};

const EventDot = styled.div<{ $urgency: string }>`
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 2px;
  background: ${(p) => urgencyColors[p.$urgency] || urgencyColors.normal};
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EventMore = styled.span`
  font-size: 10px;
  color: var(--color-text-tertiary);
  padding: 1px 4px;
`;
