import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useBoard } from '../../../app/providers/BoardProvider';
import { PostDetail } from '../../../widgets/PostDetail/ui/PostDetail';

export function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { currentPost, loadPost, isLoading, deletePost, toggleLike, addComment, deleteComment } = useBoard();

  useEffect(() => {
    if (id) loadPost(id);
  }, [id, loadPost]);

  if (isLoading) {
    return <LoadingText>로딩 중...</LoadingText>;
  }

  return (
    <Container>
      <BackLink to={currentPost ? `/board/${currentPost.category}` : '/'}>
        <ArrowLeft size={16} /> 목록으로
      </BackLink>
      <PostDetail
        post={currentPost}
        onDelete={deletePost}
        onToggleLike={toggleLike}
        onAddComment={addComment}
        onDeleteComment={deleteComment}
      />
    </Container>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  text-decoration: none;
  margin-bottom: var(--space-4);
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-text-primary);
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 80px 0;
  color: var(--color-text-tertiary);
`;
