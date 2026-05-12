import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Modal } from '../../../shared/ui/Modal';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const handleSuccess = () => {
    onClose();
    setActiveTab('login');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="계정">
      <AuthTabs>
        <AuthTab $active={activeTab === 'login'} onClick={() => setActiveTab('login')}>
          로그인
        </AuthTab>
        <AuthTab $active={activeTab === 'signup'} onClick={() => setActiveTab('signup')}>
          회원가입
        </AuthTab>
      </AuthTabs>

      {activeTab === 'login' && <LoginForm onSuccess={handleSuccess} />}
      {activeTab === 'signup' && <SignupForm onSuccess={handleSuccess} />}
    </Modal>
  );
}

const AuthTabs = styled.div`
  display: flex;
  gap: var(--space-1);
  margin-bottom: var(--space-6);
  padding: var(--space-1);
  background: var(--color-bg-tertiary, var(--color-surface));
  border-radius: var(--radius-md);
`;

const AuthTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: var(--space-2) var(--space-4);
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);

  background: ${(props) => (props.$active ? 'var(--color-bg-elevated, var(--color-bg-secondary))' : 'transparent')};
  color: ${(props) => (props.$active ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)')};
  box-shadow: ${(props) => (props.$active ? 'var(--shadow-sm)' : 'none')};

  &:hover {
    color: var(--color-text-primary);
  }
`;
