import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { User, LogOut, Settings, Sun, Moon, Share2 } from 'lucide-react';
import styled from '@emotion/styled';
import { useAuth } from '../../../entities/user/model/AuthProvider';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { AuthModal } from '../../../features/auth/ui/AuthModal';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

const NAV_ITEMS = [
  { path: '/', label: '홈' },
  { path: '/board/major', label: '전공' },
  { path: '/board/general', label: '일반과목' },
  { path: '/board/free', label: '자유' },
  { path: '/board/project', label: '사이드 프로젝트' },
];

export function Header(props: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const authRequired = location.state && location.state.authRequired;
    if (authRequired && !user) {
      setShowAuthModal(true);
    }
  }, [location.state, user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    if (user) {
      setShowDropdown((prev) => !prev);
    }
    if (!user) {
      setShowAuthModal(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  let themeLabel = '다크 모드';
  let themeTitle = '다크 모드로 전환';
  if (theme !== 'light') {
    themeLabel = '라이트 모드';
    themeTitle = '라이트 모드로 전환';
  }

  return (
    <React.Fragment>
      <HeaderContainer id="main-header" {...props}>
        <HeaderInner>
          <HeaderLogo to="/">
            <HeaderLogoIcon>
              <Share2 size={18} color="#fff" />
            </HeaderLogoIcon>
            <HeaderLogoText>ShareData</HeaderLogoText>
          </HeaderLogo>

          <HeaderNav id="main-nav">
            {NAV_ITEMS.map((item) => {
              const isEnd = item.path === '/';
              return (
                <HeaderNavLink key={item.path} to={item.path} end={isEnd}>
                  {item.label}
                </HeaderNavLink>
              );
            })}
          </HeaderNav>

          <HeaderActions>
            <HeaderThemeBtn
              onClick={toggleTheme}
              aria-label={themeLabel}
              title={themeTitle}
            >
              {theme === 'light' && <Moon size={18} />}
              {theme !== 'light' && <Sun size={18} />}
            </HeaderThemeBtn>

            <HeaderUserMenu ref={dropdownRef}>
              <HeaderProfileBtn
                $loggedIn={!!user}
                onClick={handleProfileClick}
                aria-label="프로필"
                id="profile-btn"
              >
                {user && user.nickname.charAt(0)}
                {!user && <User size={18} />}
              </HeaderProfileBtn>

              {showDropdown && user && (
                <HeaderDropdown>
                  <HeaderDropdownUser>
                    <HeaderDropdownUserName>{user.nickname}</HeaderDropdownUserName>
                  </HeaderDropdownUser>
                  <HeaderDropdownItem to="/profile" onClick={() => setShowDropdown(false)}>
                    <Settings size={16} />
                    설정
                  </HeaderDropdownItem>
                  <HeaderDropdownDivider />
                  <HeaderDropdownButton onClick={handleLogout}>
                    <LogOut size={16} />
                    로그아웃
                  </HeaderDropdownButton>
                </HeaderDropdown>
              )}
            </HeaderUserMenu>
          </HeaderActions>
        </HeaderInner>
      </HeaderContainer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </React.Fragment>
  );
}

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--header-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--color-border);
  z-index: var(--z-sticky);
  transition: background var(--transition-base);
`;

const HeaderInner = styled.div`
  max-width: var(--max-width);
  height: 100%;
  margin: 0 auto;
  padding: 0 var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-6);
`;

const HeaderLogo = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  color: var(--color-text-primary);
  flex-shrink: 0;
`;

const HeaderLogoIcon = styled.div`
  width: 34px;
  height: 34px;
  background: var(--color-accent-gradient);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const HeaderLogoText = styled.span`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent-secondary);
`;

const HeaderNav = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-left: auto;

  @media (max-width: 768px) {
    display: none;
  }
`;

const HeaderNavLink = styled(NavLink)`
  position: relative;
  padding: var(--space-2) var(--space-4);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  white-space: nowrap;

  &:hover {
    color: var(--color-text-primary);
    background: var(--color-surface-hover);
  }

  &.active {
    color: var(--color-accent-primary);
    background: var(--color-accent-bg);

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background: var(--color-accent-primary);
      border-radius: var(--radius-full);
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
`;

const HeaderThemeBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  cursor: pointer;
  background: transparent;
  border: none;

  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-text-primary);
  }
`;

const HeaderUserMenu = styled.div`
  position: relative;
`;

const HeaderProfileBtn = styled.button<{ $loggedIn: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  cursor: pointer;

  &:hover {
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary);
  }

  ${(props) => {
    if (props.$loggedIn) {
      return `
        background: var(--color-accent-gradient);
        border-color: transparent;
        color: #fff;
        font-weight: var(--font-weight-semibold);
        font-size: var(--font-size-sm);

        &:hover {
          color: #fff;
        }
      `;
    }
  }}
`;

const HeaderDropdown = styled.div`
  position: absolute;
  top: calc(100% + var(--space-2));
  right: 0;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  padding: var(--space-2);
  animation: fadeInUp var(--transition-fast) ease-out;
  z-index: var(--z-dropdown);
`;

const HeaderDropdownUser = styled.div`
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-2);
`;

const HeaderDropdownUserName = styled.div`
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
`;

const HeaderDropdownUserEmail = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-top: var(--space-1);
`;

const HeaderDropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  width: 100%;
  text-align: left;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-text-primary);
  }
`;

const HeaderDropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  width: 100%;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: none;

  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-text-primary);
  }
`;

const HeaderDropdownDivider = styled.div`
  height: 1px;
  background: var(--color-border);
  margin: var(--space-2) 0;
`;
