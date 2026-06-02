import React from 'react';
import styled from '@emotion/styled';
import { Calendar } from '../../../widgets/Calendar/ui/Calendar';
import { DeadlineList } from '../../../widgets/Deadline/ui/DeadlineList';
import { useDeadline } from '../../../app/providers/DeadlineProvider';

export function HomePage() {
  const { deadlines, upcomingDeadlines, createDeadline, toggleComplete, deleteDeadline } = useDeadline();

  return (
    <Container>
      <Welcome>
        <h1>Belog</h1>
        <p>정보를 공유하고 과제를 관리하세요.</p>
      </Welcome>
      <Content>
        <Calendar deadlines={deadlines} onCreateDeadline={createDeadline} onDeleteDeadline={deleteDeadline} />
        <DeadlineList upcomingDeadlines={upcomingDeadlines} onToggleComplete={toggleComplete} onDelete={deleteDeadline} />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
`;

const Welcome = styled.div`
  text-align: center;
  padding: var(--space-8) 0;

  h1 {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    background: var(--color-accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 var(--space-2) 0;
  }

  p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
    margin: 0;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;
