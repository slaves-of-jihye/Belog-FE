import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { Inbox, Eye } from 'lucide-react';
import { getPostList } from '../../../entities/post/api/postApi';
import { BoardType, PostSummary } from '../../../entities/post/model/types';
import { formatDate } from '../../../shared/lib/dateUtils';

export interface BoardListProps {
  boardType: BoardType;
}

export function BoardList({ boardType }: BoardListProps) {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getPostList(boardType);
        if (isMounted) {
          setPosts(response.posts || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('게시물을 불러오는데 실패했습니다.');
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [boardType]);

  if (loading) {
    return <LoadingWrapper>로딩 중...</LoadingWrapper>;
  }

  if (error) {
    return <ErrorWrapper>{error}</ErrorWrapper>;
  }

  if (posts.length === 0) {
    return (
      <EmptyWrapper>
        <IconWrapper>
          <Inbox size={48} />
        </IconWrapper>
        <p>아직 게시물이 없습니다.</p>
        <SubText>첫 번째 글을 작성해보세요!</SubText>
      </EmptyWrapper>
    );
  }

  return (
    <ListContainer>
      {posts.map((post, index) => {
        return (
          <CardLink key={post.postId} to={`/post/${post.postId}`} style={{ animationDelay: `${index * 60}ms` }}>
            <CardBody>
              <CardTitle>{post.title}</CardTitle>
              <CardMeta>
                <span>{post.authorNickname}</span>
                <span>·</span>
                <span>{formatDate(post.createdAt)}</span>
              </CardMeta>
            </CardBody>
            <CardStats>
              <span><Eye size={14} /> {post.views}</span>
            </CardStats>
          </CardLink>
        );
      })}
    </ListContainer>
  );
}

const LoadingWrapper = styled.div`
  text-align: center;
  padding: var(--space-8) 0;
  color: var(--color-text-secondary);
`;

const ErrorWrapper = styled.div`
  text-align: center;
  padding: var(--space-8) 0;
  color: var(--color-danger);
`;

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12) 0;
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-border);
  text-align: center;

  p {
    margin: 0;
    color: var(--color-text-primary);
    font-weight: var(--font-weight-medium);
  }
`;

const IconWrapper = styled.div`
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-4);
`;

const SubText = styled.p`
  margin-top: var(--space-2) !important;
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary) !important;
  font-weight: normal !important;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const CardLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition-fast);
  animation: slideUp var(--transition-base) ease-out both;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--color-border-hover);
    box-shadow: var(--shadow-sm);
    background: var(--color-surface-hover);
  }
`;

const CardBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTitle = styled.div`
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
`;

const CardStats = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);

  span {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }
`;
