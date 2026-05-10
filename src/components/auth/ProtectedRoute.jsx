import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // 세션 복원 완료 전에는 렌더링 보류
  if (isLoading) return null;

  if (!user) {
    // 로그인 후 원래 페이지로 돌아올 수 있도록 현재 경로 전달
    return <Navigate to="/" state={{ authRequired: true, from: location.pathname }} replace />;
  }

  return children;
}
