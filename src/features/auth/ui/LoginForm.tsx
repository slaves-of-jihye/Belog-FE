import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../../../entities/user/model/AuthProvider';
import { Button } from '../../../shared/ui/Button';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch {
      // error is handled in context
    }
    
    setLoading(false);
  };

  return (
    <AuthForm onSubmit={handleSubmit}>
      <AuthField>
        <label htmlFor="login-email">이메일</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => { clearError(); setEmail(e.target.value); }}
          placeholder="이메일을 입력하세요"
          required
        />
      </AuthField>

      <AuthField>
        <label htmlFor="login-password">비밀번호</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => { clearError(); setPassword(e.target.value); }}
          placeholder="비밀번호를 입력하세요"
          required
        />
      </AuthField>

      {error && <AuthError>{error}</AuthError>}

      <SubmitWrapper>
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          로그인
        </Button>
      </SubmitWrapper>
    </AuthForm>
  );
}

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
`;

const AuthField = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
  }

  input {
    padding: var(--space-3) var(--space-4);
    background: var(--color-bg-input);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    transition: all var(--transition-fast);
    outline: none;

    &:focus {
      border-color: var(--color-border-focus);
      box-shadow: 0 0 0 3px var(--color-accent-bg);
    }

    &::placeholder {
      color: var(--color-text-tertiary);
    }
  }
`;

const AuthError = styled.div`
  padding: var(--space-3) var(--space-4);
  background: var(--color-danger-bg);
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: var(--radius-md);
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  animation: fadeInUp var(--transition-fast) ease-out;
`;

const SubmitWrapper = styled.div`
  margin-top: var(--space-2);
`;

