import React from 'react';
import styled from '@emotion/styled';
import { formatRelativeDate, getDeadlineUrgency, formatDate } from '../../../shared/lib/dateUtils';
import { Deadline } from '../../../entities/deadline/model/types';
import { Trash2 } from 'lucide-react';

interface DeadlineCardProps {
  deadline: Deadline;
  index?: number;
  onToggleComplete: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function DeadlineCard({ deadline, index = 0, onToggleComplete, onDelete }: DeadlineCardProps) {
  const urgency = getDeadlineUrgency(deadline.dueDate);
  const relativeDate = formatRelativeDate(deadline.dueDate);

  return (
    <Card $urgency={urgency} $completed={deadline.completed} style={{ animationDelay: `${index * 80}ms` }}>
      <Checkbox
        $checked={deadline.completed}
        onClick={() => onToggleComplete(deadline.id)}
        role="checkbox"
        aria-checked={deadline.completed}
        tabIndex={0}
      />
      <CardBody>
        <CardTitle $completed={deadline.completed}>{deadline.title}</CardTitle>
        <CardDesc>{deadline.description}</CardDesc>
        <CardMeta>
          <Subject>{deadline.subject}</Subject>
          <Due $urgency={urgency}>
            {relativeDate} · {formatDate(deadline.dueDate, 'M/d HH:mm')}
          </Due>
        </CardMeta>
      </CardBody>
      {onDelete && (
        <DeleteButton onClick={() => onDelete(deadline.id)} aria-label="삭제">
          <Trash2 size={14} />
        </DeleteButton>
      )}
    </Card>
  );
}

const urgencyBorder: Record<string, string> = {
  overdue: '#ef4444',
  urgent: '#f59e0b',
  warning: '#eab308',
  soon: '#3b82f6',
  normal: 'var(--color-border)',
};

const Card = styled.div<{ $urgency: string; $completed: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-left: 3px solid ${(p) => urgencyBorder[p.$urgency] || 'var(--color-border)'};
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
  animation: slideUp var(--transition-base) ease-out both;
  opacity: ${(p) => (p.$completed ? 0.6 : 1)};

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
`;

const Checkbox = styled.div<{ $checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  border: 2px solid ${(p) => (p.$checked ? 'var(--color-accent-primary)' : 'var(--color-border)')};
  background: ${(p) => (p.$checked ? 'var(--color-accent-primary)' : 'transparent')};
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all var(--transition-fast);
  position: relative;

  &::after {
    content: '${(p: { $checked: boolean }) => (p.$checked ? '✓' : '')}';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 11px;
    font-weight: bold;
  }

  &:hover {
    border-color: var(--color-accent-primary);
  }
`;

const CardBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTitle = styled.div<{ $completed: boolean }>`
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  text-decoration: ${(p) => (p.$completed ? 'line-through' : 'none')};
`;

const CardDesc = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: 2px;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
  flex-wrap: wrap;
`;

const Subject = styled.span`
  font-size: var(--font-size-xs);
  padding: 1px 6px;
  background: var(--color-accent-bg);
  color: var(--color-accent-primary);
  border-radius: var(--radius-sm);
`;

const urgencyTextColors: Record<string, string> = {
  overdue: '#ef4444',
  urgent: '#f59e0b',
  warning: '#eab308',
  soon: '#3b82f6',
  normal: 'var(--color-text-tertiary)',
};

const Due = styled.span<{ $urgency: string }>`
  font-size: var(--font-size-xs);
  color: ${(p) => urgencyTextColors[p.$urgency] || 'var(--color-text-tertiary)'};
`;

const DeleteButton = styled.button`
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
  align-self: center;

  &:hover {
    color: var(--color-danger);
    background: var(--color-surface-hover);
  }
`;
