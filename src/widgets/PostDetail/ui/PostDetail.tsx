import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Paperclip, Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../entities/user/model/AuthProvider';
import { formatDate } from '../../../shared/lib/dateUtils';
import { getBoardCategory } from '../../../shared/lib/boards';
import { Post } from '../../../entities/post/model/types';
import { Button } from '../../../shared/ui/Button';
import { Modal } from '../../../shared/ui/Modal';

interface PostDetailProps {
  post: Post | null;
  onDelete: (id: string) => Promise<void>;
}

export function PostDetail({ post, onDelete }: PostDetailProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!post) return null;

  const category = getBoardCategory(post.boardType);

  const getValidUrl = (url?: string): string => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `http://${url}`;
  };

  const renderMarkdown = (md: string): string => {
    if (!md) return '';
    let html = md
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
    html = html.replace(/(<li>.*?<\/li>)+/gs, '<ul>$&</ul>');
    return `<p>${html}</p>`;
  };

  return (
    <Container>
      <Header>
        {category && <CategoryBadge>{category.name}</CategoryBadge>}
        <Title>{post.title}</Title>
        <Meta>
          <span>{post.authorNickname}</span>
          <Separator>·</Separator>
          <span>{formatDate(post.createdAt, 'yyyy.MM.dd HH:mm')}</span>
          <Separator>·</Separator>
          <span>조회 {post.views}</span>
        </Meta>
        {String(user?.id) === post.authorId && (
          <Actions>
            <Button size="sm" variant="secondary" onClick={() => navigate(`/edit/${post.postId}?boardType=${post.boardType}`)}>수정</Button>
            <Button size="sm" variant="secondary" onClick={() => setIsDeleteModalOpen(true)}>삭제</Button>
          </Actions>
        )}
      </Header>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="게시물 삭제"
        footer={
          <ModalFooter>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>취소</Button>
            <Button variant="danger" onClick={async () => {
              await onDelete(post.postId);
              setIsDeleteModalOpen(false);
              navigate(`/board/${post.boardType}`);
            }}>삭제</Button>
          </ModalFooter>
        }
      >
        <p>정말 이 게시물을 삭제하시겠습니까?</p>
      </Modal>

      <Content dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />

      {post.fileName && (
        <FileBlock>
          <FileIcon><Paperclip size={32} /></FileIcon>
          <FileInfo>
            <h3>{post.fileName}</h3>
          </FileInfo>
          {post.linkUrl && (
            <DownloadLink href={post.linkUrl} download={post.fileName}>
              다운로드
            </DownloadLink>
          )}
        </FileBlock>
      )}

      {post.linkUrl && !post.fileName && (
        <LinkBlock href={getValidUrl(post.linkUrl)} target="_blank" rel="noopener noreferrer">
          <LinkTitle><Link2 size={16} /> {post.linkUrl}</LinkTitle>
          <LinkUrl>{post.linkUrl}</LinkUrl>
        </LinkBlock>
      )}
    </Container>
  );
}

const Container = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
`;

const Header = styled.div`
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border);
`;

const CategoryBadge = styled.div`
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  background: var(--color-accent-bg);
  color: var(--color-accent-primary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-3);
`;

const Title = styled.h1`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3) 0;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
`;

const Separator = styled.span`
  color: var(--color-text-tertiary);
`;

const Actions = styled.div`
  margin-top: var(--space-4);
  display: flex;
  gap: var(--space-2);
`;

const ModalFooter = styled.div`
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  width: 100%;
`;

const Content = styled.div`
  color: var(--color-text-primary);
  line-height: var(--line-height-relaxed);
  font-size: var(--font-size-base);

  h1, h2, h3 { margin: var(--space-4) 0 var(--space-2); color: var(--color-text-primary); }
  h1 { font-size: var(--font-size-2xl); }
  h2 { font-size: var(--font-size-xl); }
  h3 { font-size: var(--font-size-lg); }
  strong { font-weight: var(--font-weight-semibold); }
  code { padding: 2px 6px; background: var(--color-bg-tertiary, var(--color-surface)); border-radius: var(--radius-sm); font-size: 0.9em; }
  ul { padding-left: var(--space-6); }
  li { margin-bottom: var(--space-1); }
  blockquote { border-left: 3px solid var(--color-accent-primary); padding-left: var(--space-4); color: var(--color-text-secondary); margin: var(--space-3) 0; }
`;

const FileBlock = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  background: var(--color-bg-tertiary, var(--color-surface));
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);

  h3 { margin: 0; font-size: var(--font-size-base); color: var(--color-text-primary); }
  p { margin: var(--space-1) 0 0; font-size: var(--font-size-sm); color: var(--color-text-tertiary); }
`;

const FileIcon = styled.div`
  color: var(--color-accent-primary);
`;

const FileInfo = styled.div`
  flex: 1;
`;

const DownloadLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-3);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  text-decoration: none;

  &:hover {
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary);
  }
`;

const LinkBlock = styled.a`
  display: block;
  padding: var(--space-5);
  background: var(--color-bg-tertiary, var(--color-surface));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--color-accent-primary);
    transform: translateY(-1px);
  }
`;

const LinkTitle = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: var(--font-weight-medium);
  color: var(--color-accent-primary);
  margin-bottom: var(--space-2);
`;

const LinkUrl = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
`;
