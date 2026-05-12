import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../../../entities/user/model/AuthProvider';
import { formatDate } from '../../../shared/lib/dateUtils';
import { Button } from '../../../shared/ui/Button';

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  comments?: Comment[];
}

interface CommentSectionProps {
  post: Post;
  onAddComment: (postId: string, data: { authorId: string; authorName: string; content: string }) => Promise<void>;
  onDeleteComment: (postId: string, commentId: string) => Promise<void>;
}

export function CommentSection({ post, onAddComment, onDeleteComment }: CommentSectionProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!content.trim()) return;

    setLoading(true);
    try {
      await onAddComment(post.id, {
        authorId: String(user.id),
        authorName: user.nickname,
        content: content.trim(),
      });
      setContent('');
    } catch {
      alert('댓글 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await onDeleteComment(post.id, commentId);
    } catch {
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const comments = post.comments || [];

  return (
    <Container>
      <Title>댓글 {comments.length}</Title>

      <CommentForm onSubmit={handleSubmit}>
        <CommentTextarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={user ? '댓글을 입력하세요...' : '로그인 후 댓글을 작성할 수 있습니다.'}
          disabled={!user || loading}
        />
        <CommentFormActions>
          <Button type="submit" disabled={!user || !content.trim() || loading} loading={loading}>
            등록
          </Button>
        </CommentFormActions>
      </CommentForm>

      <CommentList>
        {comments.map((comment) => (
          <CommentItem key={comment.id}>
            <CommentHeader>
              <CommentAuthor>{comment.authorName}</CommentAuthor>
              <CommentMeta>
                {formatDate(comment.createdAt, 'yyyy.MM.dd HH:mm')}
                {String(user?.id) === comment.authorId && (
                  <DeleteBtn onClick={() => handleDelete(comment.id)}>삭제</DeleteBtn>
                )}
              </CommentMeta>
            </CommentHeader>
            <CommentBody>{comment.content}</CommentBody>
          </CommentItem>
        ))}
      </CommentList>
    </Container>
  );
}

const Container = styled.div`
  margin-top: var(--space-8);
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-6);
`;

const Title = styled.h3`
  margin-bottom: var(--space-4);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  resize: vertical;
  outline: none;
  transition: border-color var(--transition-fast);

  &:focus {
    border-color: var(--color-accent-primary);
  }

  &::placeholder {
    color: var(--color-text-tertiary);
  }
`;

const CommentFormActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const CommentItem = styled.div`
  padding: var(--space-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);
`;

const CommentAuthor = styled.div`
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
`;

const CommentMeta = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  display: flex;
  gap: var(--space-2);
  align-items: center;
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: var(--color-danger);
  cursor: pointer;
  font-size: var(--font-size-xs);
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const CommentBody = styled.div`
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
`;
