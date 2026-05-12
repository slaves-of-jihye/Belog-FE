import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../../../entities/user/model/AuthProvider';
import { Button } from '../../../shared/ui/Button';

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const { signup, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 6) {
      setLocalError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      if (onSuccess) onSuccess();
    } catch {
      // error is handled in context
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <AuthForm onSubmit={handleSubmit}>
      {displayError && <AuthError>{displayError}</AuthError>}

      <AuthField>
        <label htmlFor="signup-name">이름</label>
        <input
          id="signup-name"
          type="text"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => { clearError(); setLocalError(''); setName(e.target.value); }}
          required
        />
      </AuthField>

      <AuthField>
        <label htmlFor="signup-email">이메일</label>
        <input
          id="signup-email"
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => { clearError(); setLocalError(''); setEmail(e.target.value); }}
          required
        />
      </AuthField>

      <AuthField>
        <label htmlFor="signup-password">비밀번호</label>
        <input
          id="signup-password"
          type="password"
          placeholder="6자 이상 입력하세요"
          value={password}
          onChange={(e) => { clearError(); setLocalError(''); setPassword(e.target.value); }}
          required
          minLength={6}
        />
      </AuthField>

      <AuthField>
        <label htmlFor="signup-confirm">비밀번호 확인</label>
        <input
          id="signup-confirm"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={confirmPassword}
          onChange={(e) => { clearError(); setLocalError(''); setConfirmPassword(e.target.value); }}
          required
        />
      </AuthField>

      <SubmitWrapper>
        <Button type="submit" fullWidth loading={loading}>
          회원가입
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
    background: var(--color-bg-input, var(--color-bg-secondary));
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    transition: all var(--transition-fast);
    outline: none;

    &:focus {
      border-color: var(--color-border-focus, var(--color-accent-primary));
      box-shadow: 0 0 0 3px var(--color-accent-bg);
    }

    &::placeholder {
      color: var(--color-text-tertiary);
    }
  }
`;

const AuthError = styled.div`
  padding: var(--space-3) var(--space-4);
  background: var(--color-danger-bg, rgba(248, 113, 113, 0.1));
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: var(--radius-md);
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  animation: fadeInUp var(--transition-fast) ease-out;
`;

const SubmitWrapper = styled.div`
  margin-top: var(--space-2);
`;
