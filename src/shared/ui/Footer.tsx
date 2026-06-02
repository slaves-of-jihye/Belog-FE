import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { Globe, MessageCircle, Mail } from 'lucide-react';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

export function Footer(props: FooterProps) {
  return (
    <FooterContainer {...props}>
      <FooterInner>
        <FooterBrand>
          <FooterLogo>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" fontSize="18" fontWeight="800" fontFamily="system-ui, sans-serif">B</text>
            </svg>
            <span>Belog</span>
          </FooterLogo>
          <p>지식과 자료를 나누는 공간</p>
        </FooterBrand>
        
        <FooterLinks>
          <FooterLinkGroup>
            <h4>서비스</h4>
            <a href="#">공지사항</a>
            <a href="#">이용약관</a>
            <a href="#">개인정보처리방침</a>
          </FooterLinkGroup>
          <FooterLinkGroup>
            <h4>고객지원</h4>
            <a href="#">FAQ</a>
            <a href="#">문의하기</a>
          </FooterLinkGroup>
          <FooterLinkGroup>
            <h4>소셜</h4>
            <FooterSocials>
              <a href="#" aria-label="Website"><Globe size={20} /></a>
              <a href="#" aria-label="Community"><MessageCircle size={20} /></a>
              <a href="#" aria-label="Mail"><Mail size={20} /></a>
            </FooterSocials>
          </FooterLinkGroup>
        </FooterLinks>
      </FooterInner>
      <FooterBottom>
        <p>&copy; {new Date().getFullYear()} Belog. All rights reserved.</p>
      </FooterBottom>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  background-color: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  padding: var(--space-12) 0 var(--space-6);
  margin-top: auto;
`;

const FooterInner = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const FooterBrand = styled.div`
  p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-accent-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-2);
`;

const FooterLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-10);
`;

const FooterLinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);

  h4 {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin-bottom: var(--space-1);
  }

  a {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);

    &:hover {
      color: var(--color-accent-primary);
    }
  }
`;

const FooterSocials = styled.div`
  display: flex;
  gap: var(--space-3);

  a {
    color: var(--color-text-tertiary);

    &:hover {
      color: var(--color-text-primary);
    }
  }
`;

const FooterBottom = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-6) var(--space-6) 0;
  margin-top: var(--space-8);
  border-top: 1px solid var(--color-border);
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
`;
