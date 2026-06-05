import React from 'react';
import styled from '@emotion/styled';
import { Clock, CheckCircle } from 'lucide-react';
import { Deadline } from '../../../entities/deadline/model/types';
import { DeadlineCard } from './DeadlineCard';

interface DeadlineListProps {
  upcomingDeadlines: Deadline[];
  onToggleComplete: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function DeadlineList({ upcomingDeadlines, onToggleComplete, onDelete }: DeadlineListProps) {
  return (
    <Container id="deadline-list">
      <Header>
        <HeaderTitle>
          <Clock size={20} />
          마감 임박
          {upcomingDeadlines.length > 0 && <Badge>{upcomingDeadlines.length}</Badge>}
        </HeaderTitle>
      </Header>

      <List>
        {upcomingDeadlines.length === 0 && (
          <EmptyState>
            <CheckCircle size={48} />
            <p>3일 내 마감 과제가 없습니다!</p>
          </EmptyState>
        )}

        {upcomingDeadlines.length > 0 &&
          upcomingDeadlines.map((deadline, idx) => (
            <DeadlineCard key={deadline.id} deadline={deadline} index={idx} onToggleComplete={onToggleComplete} onDelete={onDelete} />
          ))
        }
      </List>
    </Container>
  );
}

const Container = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
`;

const Header = styled.div`
  margin-bottom: var(--space-4);
`;

const HeaderTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;

  svg {
    color: var(--color-accent-primary);
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 var(--space-2);
  background: var(--color-danger, #ef4444);
  color: #fff;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-8) 0;
  color: var(--color-text-tertiary);

  svg {
    margin-bottom: var(--space-3);
    color: #22c55e;
  }

  p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }
`;
