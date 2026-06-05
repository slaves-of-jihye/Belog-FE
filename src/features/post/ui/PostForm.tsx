import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { createPost } from '../../../entities/post/api/postApi';
import { BoardType } from '../../../entities/post/model/types';
import { boardCategories } from '../../../shared/lib/boards';
import { Button } from '../../../shared/ui/Button';
import '@toast-ui/editor/dist/toastui-editor.css';

export interface PostFormProps {
  onSuccess?: () => void;
}

export function PostForm({ onSuccess }: PostFormProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedBoardType = searchParams.get('boardType') || 'free';
  let initialBoardType: BoardType = 'free';
  if (boardCategories.some((category) => category.id === requestedBoardType)) {
    initialBoardType = requestedBoardType as BoardType;
  }
  const [title, setTitle] = useState('');
  const [boardType, setBoardType] = useState<BoardType>(initialBoardType);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initEditor = async () => {
      const { default: Editor } = await import('@toast-ui/editor');

      if (!editorRef.current) return;

      const editor = new Editor({
        el: editorRef.current,
        height: '400px',
        initialEditType: 'markdown',
        previewStyle: 'vertical',
        initialValue: '',
        placeholder: '마크다운으로 내용을 작성하세요...',
        theme: 'dark',
      });

      editorInstanceRef.current = editor;
    };

    initEditor();

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    let content = '';
    if (editorInstanceRef.current) {
      content = editorInstanceRef.current.getMarkdown();
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      await createPost(boardType, { title, content });
      if (onSuccess) {
        onSuccess();
      }
      if (!onSuccess) {
        navigate(`/board/${boardType}`);
      }
    } catch (err) {
      alert('게시물 작성 중 오류가 발생했습니다.');
    }

    setLoading(false);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <label htmlFor="boardType">게시판 선택</label>
        <Select
          id="boardType"
          value={boardType}
          onChange={(e) => setBoardType(e.target.value as BoardType)}
        >
          <option value="major">전공</option>
          <option value="general">일반과목</option>
          <option value="free">자유</option>
          <option value="project">사이드 프로젝트</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <label htmlFor="title">제목</label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
        />
      </FormGroup>

      <FormGroup>
        <label>내용</label>
        <EditorWrapper>
          <div ref={editorRef} />
        </EditorWrapper>
      </FormGroup>

      <ButtonGroup>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          취소
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          게시하기
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  background: var(--color-bg-secondary);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
  }
`;

const Select = styled.select`
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  outline: none;
  transition: all var(--transition-fast);

  &:focus {
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 3px var(--color-accent-bg);
  }
`;

const Input = styled.input`
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  outline: none;
  transition: all var(--transition-fast);

  &:focus {
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 3px var(--color-accent-bg);
  }

  &::placeholder {
    color: var(--color-text-tertiary);
  }
`;

const EditorWrapper = styled.div`
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  
  .toastui-editor-defaultUI {
    border: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-4);
`;
