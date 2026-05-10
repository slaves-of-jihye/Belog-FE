import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { User, LogOut, Settings, Sun, Moon, Share2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import AuthModal from '../auth/AuthModal';
import './Header.css';

const NAV_ITEMS = [
  { path: '/', label: '홈' },
  { path: '/board/major', label: '전공' },
  { path: '/board/general', label: '일반과목' },
  { path: '/board/free', label: '자유' },
  { path: '/board/project', label: '사이드 프로젝트' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // ProtectedRoute에서 리다이렉트된 경우 로그인 모달 자동 오픈
  useEffect(() => {
    if (location.state?.authRequired && !user) {
      setShowAuthModal(true);
    }
  }, [location.state, user]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    if (user) {
      setShowDropdown((prev) => !prev);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  return (
    <>
      <header className="header" id="main-header">
        <div className="header-inner">
          <Link to="/" className="header-logo">
            <div className="header-logo-icon"><Share2 size={18} color="#fff" /></div>
            <span className="header-logo-text">ShareData</span>
          </Link>

          <nav className="header-nav" id="main-nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `header-nav-link${isActive ? ' active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="header-theme-btn"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? '다크 모드' : '라이트 모드'}
              title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <div className="header-user-menu" ref={dropdownRef}>
              <button
                className={`header-profile-btn${user ? ' logged-in' : ''}`}
                onClick={handleProfileClick}
                aria-label="프로필"
                id="profile-btn"
              >
                {user ? user.name.charAt(0) : <User size={18} />}
              </button>

              {showDropdown && user && (
                <div className="header-dropdown">
                  <div className="header-dropdown-user">
                    <div className="header-dropdown-user-name">{user.name}</div>
                    <div className="header-dropdown-user-email">{user.email}</div>
                  </div>
                  <Link to="/profile" className="header-dropdown-item" onClick={() => setShowDropdown(false)}>
                    <Settings size={16} />
                    설정
                  </Link>
                  <div className="header-dropdown-divider" />
                  <button className="header-dropdown-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
