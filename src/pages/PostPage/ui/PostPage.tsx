import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PostDetail } from '../../../widgets/PostDetail/ui/PostDetail';
import { getPostDetail, deletePost } from '../../../entities/post/api/postApi';
import { Post } from '../../../entities/post/model/types';

export function PostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      setIsLoading(true);
      setError('');
      try {
        const nextPost = await getPostDetail(id);
        setPost(nextPost);
      } catch {
        setError('게시물을 불러오지 못했습니다.');
      }
      setIsLoading(false);
    };

    loadPost();
  }, [id]);

  const handleDelete = async (postId: string) => {
    await deletePost(postId);
  };

  if (isLoading) {
    return <LoadingText>로딩 중...</LoadingText>;
  }

  if (error) {
    return <LoadingText>{error}</LoadingText>;
  }

  return (
    <Container>
      <BackLink to={post ? `/board/${post.boardType}` : '/'}>
        <ArrowLeft size={16} /> 목록으로
      </BackLink>
      <PostDetail
        post={post}
        onDelete={handleDelete}
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
