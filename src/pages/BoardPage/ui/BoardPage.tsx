import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { Plus } from 'lucide-react';
import { BoardList } from '../../../widgets/BoardList/ui/BoardList';
import { Layout } from '../../../shared/ui/Layout';
import { Button } from '../../../shared/ui/Button';
import { useAuth } from '../../../entities/user/model/AuthProvider';
import { BoardType } from '../../../entities/post/model/types';

const CATEGORY_MAP: Record<string, { name: string; description: string }> = {
  major: { name: '전공 게시판', description: '전공 관련 자료 및 정보를 공유합니다.' },
  general: { name: '일반과목 게시판', description: '교양 및 일반 과목 자료를 공유합니다.' },
  free: { name: '자유 게시판', description: '자유롭게 의견을 나누는 공간입니다.' },
  project: { name: '사이드 프로젝트', description: '사이드 프로젝트 팀원 모집 및 정보 공유' },
};

export function BoardPage() {
  const { boardType } = useParams<{ boardType: string }>();
  const { user } = useAuth();

  const validBoardType = boardType as BoardType;
  const categoryInfo = CATEGORY_MAP[validBoardType] || CATEGORY_MAP.free;

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <HeaderLeft>
            <TitleWrapper>
              <CategoryTag>{categoryInfo.name}</CategoryTag>
              <PageTitle>{categoryInfo.name}</PageTitle>
            </TitleWrapper>
            <PageDesc>{categoryInfo.description}</PageDesc>
          </HeaderLeft>

          <HeaderRight>
            {user && (
              <Link to={`/create?boardType=${validBoardType}`}>
                <Button size="md">
                  <Plus size={16} /> 글쓰기
                </Button>
              </Link>
            )}
          </HeaderRight>
        </PageHeader>

        <BoardList boardType={validBoardType} />
      </PageContainer>
    </Layout>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

const CategoryTag = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-accent-primary);
  font-weight: var(--font-weight-medium);
`;

const PageTitle = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
`;

const PageDesc = styled.p`
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;

  @media (min-width: 769px) {
    width: auto;
  }
`;
