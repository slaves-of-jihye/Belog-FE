import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  differenceInCalendarDays,
  differenceInHours,
} from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatDate = (date: string | Date, fmt = 'yyyy.MM.dd'): string => {
  return format(new Date(date), fmt, { locale: ko });
};

export const formatRelativeDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  // 24시간 단위가 아닌 달력 날짜 기준으로 비교해야 함.
  // (밤 11시에 내일 오전 마감을 확인하면 24시간 미만이라 '오늘'로 잘못 표시됨)
  const diffDays = differenceInCalendarDays(date, now);

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '내일';
  if (diffDays === -1) return '어제';
  if (diffDays > 1 && diffDays <= 7) return `${diffDays}일 후`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)}일 전`;
  return formatDate(dateStr);
};

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const getCalendarDays = (currentDate: Date): CalendarDay[] => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: CalendarDay[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push({
      date: new Date(day),
      isCurrentMonth: isSameMonth(day, currentDate),
      isToday: isToday(day),
    });
    day = addDays(day, 1);
  }
  return days;
};

export type DeadlineUrgency = 'overdue' | 'urgent' | 'warning' | 'soon' | 'normal';

export const getDeadlineUrgency = (dueDateStr: string): DeadlineUrgency => {
  const now = new Date();
  const due = new Date(dueDateStr);
  const hours = differenceInHours(due, now);
  if (hours < 0) return 'overdue';
  if (hours <= 24) return 'urgent';
  if (hours <= 48) return 'warning';
  if (hours <= 72) return 'soon';
  return 'normal';
};

export const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export { addMonths, subMonths, isSameDay, format };
