import React from 'react';
import styled from '@emotion/styled';

export interface LayoutProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export function Layout({ children, ...props }: LayoutProps) {
  return (
    <LayoutMain {...props}>
      <LayoutInner>{children}</LayoutInner>
    </LayoutMain>
  );
}

const LayoutMain = styled.main`
  flex: 1;
  min-height: 100vh;
  padding-top: var(--header-height);
`;

const LayoutInner = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
`;
