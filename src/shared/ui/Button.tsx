import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <Spinner />}
      {!loading && children}
    </StyledButton>
  );
}

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

const StyledButton = styled.button<{
  $variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  $size: 'sm' | 'md' | 'lg';
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  user-select: none;
  position: relative;
  overflow: hidden;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  ${(props) => {
    if (props.$size === 'sm') {
      return `
        padding: var(--space-1) var(--space-3);
        font-size: var(--font-size-xs);
        height: 32px;
      `;
    }
    if (props.$size === 'md') {
      return `
        padding: var(--space-2) var(--space-5);
        font-size: var(--font-size-sm);
        height: 40px;
      `;
    }
    if (props.$size === 'lg') {
      return `
        padding: var(--space-3) var(--space-8);
        font-size: var(--font-size-base);
        height: 48px;
      `;
    }
  }}

  ${(props) => {
    if (props.$variant === 'primary') {
      return `
        background: var(--color-accent-gradient);
        color: #fff;
        box-shadow: var(--shadow-glow);

        &:hover:not(:disabled) {
          background: var(--color-accent-gradient-hover);
          box-shadow: var(--shadow-glow-strong);
          transform: translateY(-1px);
        }
      `;
    }
    if (props.$variant === 'secondary') {
      return `
        background: var(--color-bg-elevated);
        color: var(--color-text-primary);
        border: 1px solid var(--color-border);

        &:hover:not(:disabled) {
          background: var(--color-bg-hover);
          border-color: var(--color-border-hover);
        }
      `;
    }
    if (props.$variant === 'ghost') {
      return `
        background: transparent;
        color: var(--color-text-secondary);

        &:hover:not(:disabled) {
          background: var(--color-surface-hover);
          color: var(--color-text-primary);
        }
      `;
    }
    if (props.$variant === 'danger') {
      return `
        background: var(--color-danger);
        color: #fff;

        &:hover:not(:disabled) {
          background: #ef4444;
        }
      `;
    }
  }}

  ${(props) => {
    if (props.$fullWidth) {
      return `
        width: 100%;
      `;
    }
  }}
`;
