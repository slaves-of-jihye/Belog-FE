import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

export default function LoginForm({ onSuccess }) {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      onSuccess?.();
    } catch {
      // error is handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="auth-error">{error}</div>}

      <div className="auth-field">
        <label htmlFor="login-email">이메일</label>
        <input
          id="login-email"
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => { clearError(); setEmail(e.target.value); }}
          required
        />
      </div>

      <div className="auth-field">
        <label htmlFor="login-password">비밀번호</label>
        <input
          id="login-password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => { clearError(); setPassword(e.target.value); }}
          required
        />
      </div>

      <Button
        type="submit"
        fullWidth
        loading={loading}
        className="auth-submit-btn"
      >
        로그인
      </Button>

    </form>
  );
}
