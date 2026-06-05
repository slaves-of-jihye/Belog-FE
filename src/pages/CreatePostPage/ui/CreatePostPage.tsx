import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useSearchParams, Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, Link2 } from 'lucide-react';
import { useAuth } from '../../../entities/user/model/AuthProvider';
import { boardCategories } from '../../../shared/lib/boards';
import { BoardType } from '../../../entities/post/model/types';
import { createPost, getPostDetail, updatePost } from '../../../entities/post/api/postApi';
import { Button } from '../../../shared/ui/Button';
import '@toast-ui/editor/dist/toastui-editor.css';

const POST_TYPES = [
  { id: 'markdown' as const, label: '마크다운 에디터', icon: FileText },
  { id: 'file' as const, label: '파일 업로드', icon: Upload },
  { id: 'link' as const, label: '링크 공유', icon: Link2 },
];

const VALID_FILE_EXTS = ['.pdf', '.jpg', '.jpeg', '.png', '.zip', '.docx', '.pptx'];

function isValidFile(file: File) {
  const dotIndex = file.name.lastIndexOf('.');
  if (dotIndex < 0) {
    return false;
  }
  const ext = file.name.slice(dotIndex).toLowerCase();
  return VALID_FILE_EXTS.includes(ext);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('파일을 읽지 못했습니다.'));
    };
    reader.onerror = () => {
      reject(new Error('파일을 읽지 못했습니다.'));
    };
    reader.readAsDataURL(file);
  });
}

export function CreatePostPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedBoardType = searchParams.get('boardType') || searchParams.get('category') || 'free';
  let defaultBoardType: BoardType = 'free';
  if (boardCategories.some((category) => category.id === requestedBoardType)) {
    defaultBoardType = requestedBoardType as BoardType;
  }
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [boardType, setBoardType] = useState<BoardType>(defaultBoardType);
  const [postType, setPostType] = useState<'markdown' | 'file' | 'link'>('markdown');
  const [markdownContent, setMarkdownContent] = useState('');
  const [linkData, setLinkData] = useState<{ linkUrl: string; linkTitle: string; linkDescription: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingFileName, setExistingFileName] = useState('');
  const [existingFileUrl, setExistingFileUrl] = useState('');
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);

  let pageTitle = '새 게시물 작성';
  let submitLabel = '게시하기';
  if (isEditMode) {
    pageTitle = '게시물 수정';
    submitLabel = '수정 완료';
  }

  useEffect(() => {
    if (isEditMode && id) {
      getPostDetail(id).then((post) => {
        if (post.authorId !== user?.id) {
          alert('수정 권한이 없습니다.');
          navigate(-1);
          return;
        }
        setTitle(post.title);
        setBoardType(post.boardType);
        setMarkdownContent(post.content);
        if (post.linkUrl) {
          setPostType('link');
          setLinkData({ linkUrl: post.linkUrl, linkTitle: post.title, linkDescription: post.content });
        }
        if (post.fileName) {
          setPostType('file');
          setExistingFileName(post.fileName);
          setExistingFileUrl(post.linkUrl || '');
        }
      }).catch(() => {
        alert('게시물을 불러오지 못했습니다.');
        navigate('/');
      });
    }
  }, [id, isEditMode, user, navigate]);

  useEffect(() => {
    if (postType !== 'markdown') {
      return;
    }

    let isMounted = true;

    const initEditor = async () => {
      const { default: Editor } = await import('@toast-ui/editor');

      if (!editorRef.current) {
        return;
      }

      if (editorInstanceRef.current) {
        return;
      }

      const editor = new Editor({
        el: editorRef.current,
        height: '420px',
        initialEditType: 'markdown',
        previewStyle: 'vertical',
        initialValue: markdownContent,
        placeholder: '마크다운으로 내용을 작성하세요...',
        theme: 'dark',
        events: {
          change: () => {
            if (editorInstanceRef.current) {
              setMarkdownContent(editorInstanceRef.current.getMarkdown());
            }
          },
        },
      });

      if (isMounted) {
        editorInstanceRef.current = editor;
      }

      if (!isMounted) {
        editor.destroy();
      }
    };

    initEditor();

    return () => {
      isMounted = false;
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [postType]);

  useEffect(() => {
    if (postType === 'markdown' && editorInstanceRef.current) {
      const currentMarkdown = editorInstanceRef.current.getMarkdown();
      if (currentMarkdown !== markdownContent) {
        editorInstanceRef.current.setMarkdown(markdownContent);
      }
    }
  }, [markdownContent, postType]);

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
    let editorMarkdown = markdownContent;
    if (postType === 'markdown' && editorInstanceRef.current) {
      editorMarkdown = editorInstanceRef.current.getMarkdown();
    }
    if (postType === 'markdown' && !editorMarkdown.trim()) { alert('내용을 입력해주세요.'); return; }
    if (postType === 'link' && !linkData?.linkUrl?.trim()) { alert('링크를 입력해주세요.'); return; }
    if (postType === 'file' && !selectedFile && !existingFileName) { alert('파일을 선택해주세요.'); return; }
    setLoading(true);
    try {
      let content = '';
      if (postType === 'markdown') {
        content = editorMarkdown;
      }
      const postData: Record<string, any> = {
        title,
        content,
      };
      if (postType === 'link' && linkData) {
        postData.linkUrl = linkData.linkUrl;
        postData.content = linkData.linkDescription || linkData.linkTitle || linkData.linkUrl;
      }
      if (postType === 'file') {
        postData.content = existingFileName;
        postData.fileName = existingFileName;
        postData.linkUrl = existingFileUrl;
        if (selectedFile) {
          const fileDataUrl = await readFileAsDataUrl(selectedFile);
          postData.content = selectedFile.name;
          postData.fileName = selectedFile.name;
          postData.linkUrl = fileDataUrl;
        }
      }
      if (isEditMode && id) {
        await updatePost(id, postData);
        navigate(`/post/${id}`);
      } else {
        await createPost(boardType, postData);
        navigate(`/board/${boardType}`);
      }
    } catch {
      alert('게시물 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <BackLink to={`/board/${boardType}`}>
        <ArrowLeft size={16} /> 목록으로
      </BackLink>
      <PageTitle>{pageTitle}</PageTitle>
      <Form>
        <Field>
          <label>게시판</label>
          <Select value={boardType} onChange={(e) => setBoardType(e.target.value as BoardType)}>
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
            <EditorWrapper>
              <div ref={editorRef} />
            </EditorWrapper>
          )}
          {postType === 'link' && (
            <LinkFields>
              <Input type="url" placeholder="https://..." value={linkData?.linkUrl || ''} onChange={(e) => {
                const nextLinkData = { linkUrl: e.target.value, linkTitle: '', linkDescription: '' };
                if (linkData) {
                  nextLinkData.linkTitle = linkData.linkTitle;
                  nextLinkData.linkDescription = linkData.linkDescription;
                }
                setLinkData(nextLinkData);
              }} />
              <Input type="text" placeholder="링크 제목" value={linkData?.linkTitle || ''} onChange={(e) => {
                const nextLinkData = { linkUrl: '', linkTitle: e.target.value, linkDescription: '' };
                if (linkData) {
                  nextLinkData.linkUrl = linkData.linkUrl;
                  nextLinkData.linkDescription = linkData.linkDescription;
                }
                setLinkData(nextLinkData);
              }} />
              <Input type="text" placeholder="링크 설명" value={linkData?.linkDescription || ''} onChange={(e) => {
                const nextLinkData = { linkUrl: '', linkTitle: '', linkDescription: e.target.value };
                if (linkData) {
                  nextLinkData.linkUrl = linkData.linkUrl;
                  nextLinkData.linkTitle = linkData.linkTitle;
                }
                setLinkData(nextLinkData);
              }} />
            </LinkFields>
          )}
          {postType === 'file' && (
            <FileUploadBox>
              <FileInput
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.zip,.docx,.pptx"
                onChange={(e) => {
                  setFileError('');
                  const file = e.target.files?.[0];
                  if (!file) {
                    setSelectedFile(null);
                    return;
                  }
                  if (!isValidFile(file)) {
                    setSelectedFile(null);
                    setFileError('PDF, 이미지, ZIP, DOCX, PPTX 파일만 업로드할 수 있습니다.');
                    return;
                  }
                  if (file.size > 10 * 1024 * 1024) {
                    setSelectedFile(null);
                    setFileError('10MB 이하 파일만 업로드할 수 있습니다.');
                    return;
                  }
                  setSelectedFile(file);
                  setExistingFileName(file.name);
                  setExistingFileUrl('');
                }}
              />
              <FileHelp>PDF, JPG, PNG, ZIP, DOCX, PPTX 파일을 10MB까지 업로드할 수 있습니다.</FileHelp>
              {existingFileName && <SelectedFileName>{existingFileName}</SelectedFileName>}
              {fileError && <FileError>{fileError}</FileError>}
            </FileUploadBox>
          )}
        </Field>
        <Actions>
          <Button variant="secondary" onClick={() => navigate(-1)}>취소</Button>
          <Button loading={loading} onClick={handleSubmit}>{submitLabel}</Button>
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

const EditorWrapper = styled.div`
  background: var(--color-bg-tertiary, var(--color-surface));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;

  .toastui-editor-defaultUI {
    border: none;
  }

  .toastui-editor-toolbar {
    border-top: none;
  }
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
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);

  ${(p) => {
    if (p.$active) {
      return `
        border-color: var(--color-accent-primary);
        background: var(--color-accent-bg);
        color: var(--color-accent-primary);
      `;
    }
    return '';
  }}

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

const FileUploadBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background: var(--color-bg-tertiary, var(--color-surface));
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
`;

const FileInput = styled.input`
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
`;

const FileHelp = styled.div`
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
`;

const SelectedFileName = styled.div`
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
`;

const FileError = styled.div`
  color: var(--color-danger);
  font-size: var(--font-size-sm);
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
