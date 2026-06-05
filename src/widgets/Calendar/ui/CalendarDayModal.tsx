import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { formatDate, getDeadlineUrgency, formatRelativeDate } from '../../../shared/lib/dateUtils';
import { CreateDeadlineRequest, Deadline } from '../../../entities/deadline/model/types';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';

interface CalendarDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  events: Deadline[];
  onCreateDeadline: (data: CreateDeadlineRequest) => Promise<any>;
  onDeleteDeadline?: (id: string) => Promise<any>;
}

export function CalendarDayModal({ isOpen, onClose, date, events, onCreateDeadline, onDeleteDeadline }: CalendarDayModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    time: '23:59',
    priority: 'medium' as 'high' | 'medium' | 'low',
  });

  if (!date) return null;

  const dayLabel = format(date, 'yyyy년 M월 d일 (EEEE)', { locale: ko });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject) {
      alert('제목과 과목을 입력해주세요.');
      return;
    }

    const [hours, minutes] = formData.time.split(':');
    const dueDate = new Date(date);
    dueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    await onCreateDeadline({
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      dueDate: dueDate.toISOString(),
      category: 'major',
      priority: formData.priority,
    });

    setIsAdding(false);
    setFormData({ title: '', description: '', subject: '', time: '23:59', priority: 'medium' });
  };

  const priorityLabel = (p: string) => {
    if (p === 'high') return '높음';
    if (p === 'medium') return '보통';
    return '낮음';
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { setIsAdding(false); onClose(); }} title={dayLabel}>
      <ModalContent>
        {events.length === 0 && (
          <EmptyState>
            <Calendar size={48} />
            <p>이 날짜에 등록된 일정이 없습니다.</p>
          </EmptyState>
        )}

        {events.length > 0 && (
          <EventList>
            {events.map((event) => {
              const urgency = getDeadlineUrgency(event.dueDate);
              return (
                <EventItem key={event.id} $urgency={urgency}>
                  <EventIndicator $urgency={urgency} />
                  <EventBody>
                    <EventTitle>{event.title}</EventTitle>
                    <EventDesc>{event.description}</EventDesc>
                    <EventMeta>
                      <EventSubject>{event.subject}</EventSubject>
                      <EventDue $urgency={urgency}>
                        {formatRelativeDate(event.dueDate)} · {formatDate(event.dueDate, 'HH:mm')}
                      </EventDue>
                      <EventPriority $priority={event.priority}>
                        {priorityLabel(event.priority)}
                      </EventPriority>
                    </EventMeta>
                  </EventBody>
                  <EventActions>
                    {event.completed && <DoneBadge>완료</DoneBadge>}
                    {onDeleteDeadline && (
                      <DeleteIconBtn onClick={() => onDeleteDeadline(event.id)} aria-label="삭제">
                        <Trash2 size={14} />
                      </DeleteIconBtn>
                    )}
                  </EventActions>
                </EventItem>
              );
            })}
          </EventList>
        )}

        <AddSection>
          {!isAdding && (
            <Button variant="secondary" fullWidth onClick={() => setIsAdding(true)}>
              <Plus size={16} /> 새 과제 등록하기
            </Button>
          )}

          {isAdding && (
            <AddForm onSubmit={handleAddSubmit}>
              <FormInput
                type="text"
                placeholder="과제 제목"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <FormInput
                type="text"
                placeholder="과목명 (예: 운영체제)"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
              <FormTextarea
                placeholder="과제 설명"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <FormRow>
                <FormInput
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
                <FormSelect
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                >
                  <option value="high">우선순위: 높음</option>
                  <option value="medium">우선순위: 보통</option>
                  <option value="low">우선순위: 낮음</option>
                </FormSelect>
              </FormRow>
              <FormActions>
                <Button variant="secondary" type="button" onClick={() => setIsAdding(false)}>취소</Button>
                <Button type="submit">등록</Button>
              </FormActions>
            </AddForm>
          )}
        </AddSection>
      </ModalContent>
    </Modal>
  );
}

const ModalContent = styled.div``;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-8) 0;
  color: var(--color-text-tertiary);

  svg { margin-bottom: var(--space-3); }
  p { color: var(--color-text-secondary); font-size: var(--font-size-sm); }
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const urgencyBg: Record<string, string> = {
  overdue: 'rgba(239,68,68,0.05)',
  urgent: 'rgba(245,158,11,0.05)',
  warning: 'rgba(234,179,8,0.05)',
  soon: 'rgba(59,130,246,0.05)',
  normal: 'transparent',
};

const EventItem = styled.div<{ $urgency: string }>`
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3);
  background: ${(p) => urgencyBg[p.$urgency] || 'transparent'};
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
`;

const urgencyColors: Record<string, string> = {
  overdue: '#ef4444',
  urgent: '#f59e0b',
  warning: '#eab308',
  soon: '#3b82f6',
  normal: 'var(--color-accent-primary)',
};

const EventIndicator = styled.div<{ $urgency: string }>`
  width: 4px;
  min-height: 40px;
  border-radius: 2px;
  background: ${(p) => urgencyColors[p.$urgency] || urgencyColors.normal};
  flex-shrink: 0;
`;

const EventBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const EventTitle = styled.div`
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
`;

const EventDesc = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: 2px;
`;

const EventMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
  flex-wrap: wrap;
`;

const EventSubject = styled.span`
  font-size: var(--font-size-xs);
  padding: 1px 6px;
  background: var(--color-accent-bg);
  color: var(--color-accent-primary);
  border-radius: var(--radius-sm);
`;

const EventDue = styled.span<{ $urgency: string }>`
  font-size: var(--font-size-xs);
  color: ${(p) => urgencyColors[p.$urgency] || 'var(--color-text-tertiary)'};
`;

const priorityColors: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

const EventPriority = styled.span<{ $priority: string }>`
  font-size: var(--font-size-xs);
  color: ${(p) => priorityColors[p.$priority] || 'var(--color-text-tertiary)'};
`;

const DoneBadge = styled.div`
  padding: var(--space-1) var(--space-2);
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  flex-shrink: 0;
`;

const EventActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
  align-self: center;
`;

const DeleteIconBtn = styled.button`
  background: transparent;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--color-danger);
    background: var(--color-surface-hover);
  }
`;

const AddSection = styled.div`
  margin-top: var(--space-6);
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-4);
`;

const AddForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const FormInput = styled.input`
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  outline: none;

  &:focus { border-color: var(--color-accent-primary); }
`;

const FormTextarea = styled.textarea`
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  min-height: 60px;
  resize: vertical;
  outline: none;

  &:focus { border-color: var(--color-accent-primary); }
`;

const FormSelect = styled.select`
  flex: 1;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  outline: none;
`;

const FormRow = styled.div`
  display: flex;
  gap: var(--space-2);

  input { flex: 1; }
`;

const FormActions = styled.div`
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  margin-top: var(--space-2);
`;
