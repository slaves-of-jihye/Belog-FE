import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useSearchParams, Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, Link2 } from 'lucide-react';
import { useBoard } from '../../../app/providers/BoardProvider';
import { boardService } from '../../../shared/api/boardService';
import { useAuth } from '../../../entities/user/model/AuthProvider';
import { boardCategories } from '../../../shared/lib/mockData';
import { Button } from '../../../shared/ui/Button';

const POST_TYPES = [
  { id: 'markdown' as const, label: '마크다운 에디터', icon: FileText },
  { id: 'file' as const, label: '파일 업로드', icon: Upload },
  { id: 'link' as const, label: '링크 공유', icon: Link2 },
];

export function CreatePostPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultCategory = searchParams.get('category') || 'free';
  const { createPost, updatePost } = useBoard();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [postType, setPostType] = useState<'markdown' | 'file' | 'link'>('markdown');
  const [markdownContent, setMarkdownContent] = useState('');
  const [linkData, setLinkData] = useState<{ linkUrl: string; linkTitle: string; linkDescription: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      boardService.getPostById(id).then((post) => {
        if (post.authorId !== String(user?.id)) {
          alert('수정 권한이 없습니다.');
          navigate(-1);
          return;
        }
        setTitle(post.title);
        setCategory(post.category);
        setPostType(post.type);
        if (post.type === 'markdown') setMarkdownContent(post.content);
        if (post.type === 'link') setLinkData({ linkUrl: post.linkUrl || '', linkTitle: post.linkTitle || '', linkDescription: post.linkDescription || '' });
      }).catch(() => {
        alert('게시물을 불러오지 못했습니다.');
        navigate('/');
      });
    }
  }, [id, isEditMode, user, navigate]);

  if (!user) {
    return (
      <EmptyState>
        <p>로그인이 필요합니다.</p>
        <Link to="/"><Button variant="secondary">홈으로</Button></Link>
      </EmptyState>
    );
  }

  const handleSubmit = async () => {
    if (!title.trim()) { alert('제목을 입력해주세요.'); return; }
    setLoading(true);
    try {
      const postData: Record<string, any> = {
        title, category, type: postType,
        authorId: String(user.id), authorName: user.nickname,
        content: postType === 'markdown' ? markdownContent : '',
      };
      if (postType === 'link' && linkData) {
        Object.assign(postData, linkData);
      }
      if (isEditMode && id) {
        await updatePost(id, postData);
        navigate(`/post/${id}`);
      } else {
        await createPost(postData);
        navigate(`/board/${category}`);
      }
    } catch {
      alert('게시물 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <BackLink to={`/board/${category}`}>
        <ArrowLeft size={16} /> 목록으로
      </BackLink>
      <PageTitle>{isEditMode ? '게시물 수정' : '새 게시물 작성'}</PageTitle>
      <Form>
        <Field>
          <label>게시판</label>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {boardCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </Field>
        <Field>
          <label>제목</label>
          <Input type="text" placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field>
          <label>작성 방식</label>
          <TypeTabs>
            {POST_TYPES.map(({ id: typeId, label, icon: Icon }) => (
              <TypeTab key={typeId} $active={postType === typeId} onClick={() => setPostType(typeId)}>
                <Icon size={16} /> {label}
              </TypeTab>
            ))}
          </TypeTabs>
        </Field>
        <Field>
          {postType === 'markdown' && (
            <Textarea
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              placeholder="마크다운으로 내용을 작성하세요..."
              rows={12}
            />
          )}
          {postType === 'link' && (
            <LinkFields>
              <Input type="url" placeholder="https://..." value={linkData?.linkUrl || ''} onChange={(e) => setLinkData({ linkUrl: e.target.value, linkTitle: linkData?.linkTitle || '', linkDescription: linkData?.linkDescription || '' })} />
              <Input type="text" placeholder="링크 제목" value={linkData?.linkTitle || ''} onChange={(e) => setLinkData({ ...linkData!, linkTitle: e.target.value })} />
              <Input type="text" placeholder="링크 설명" value={linkData?.linkDescription || ''} onChange={(e) => setLinkData({ ...linkData!, linkDescription: e.target.value })} />
            </LinkFields>
          )}
          {postType === 'file' && (
            <FilePlaceholder>파일 업로드 기능은 백엔드 연동 후 지원됩니다.</FilePlaceholder>
          )}
        </Field>
        <Actions>
          <Button variant="secondary" onClick={() => navigate(-1)}>취소</Button>
          <Button loading={loading} onClick={handleSubmit}>{isEditMode ? '수정 완료' : '게시하기'}</Button>
        </Actions>
      </Form>
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

  &:hover { color: var(--color-text-primary); }
`;

const PageTitle = styled.h1`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-6) 0;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
  }
`;

const Input = styled.input`
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-tertiary, var(--color-surface));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  outline: none;
  transition: border-color var(--transition-fast);

  &:focus { border-color: var(--color-accent-primary); }
  &::placeholder { color: var(--color-text-tertiary); }
`;

const Select = styled.select`
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-tertiary, var(--color-surface));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  outline: none;
`;

const Textarea = styled.textarea`
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-tertiary, var(--color-surface));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  outline: none;
  resize: vertical;
  font-family: 'SFMono-Regular', 'Menlo', monospace;
  line-height: 1.6;

  &:focus { border-color: var(--color-accent-primary); }
  &::placeholder { color: var(--color-text-tertiary); }
`;

const TypeTabs = styled.div`
  display: flex;
  gap: var(--space-2);
`;

const TypeTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: 1px solid ${(p) => (p.$active ? 'var(--color-accent-primary)' : 'var(--color-border)')};
  border-radius: var(--radius-md);
  background: ${(p) => (p.$active ? 'var(--color-accent-bg)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)')};
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary);
  }
`;

const LinkFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const FilePlaceholder = styled.div`
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-tertiary);
  background: var(--color-bg-tertiary, var(--color-surface));
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 0;

  p {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-4);
  }
`;
