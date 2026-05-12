import React, { createContext, useReducer, useCallback, useContext, ReactNode } from 'react';
import { boardService } from '../../shared/api/boardService';
import { MockPost, BoardCategory } from '../../shared/lib/mockData';

interface BoardState {
  posts: MockPost[];
  currentPost: MockPost | null;
  categories: BoardCategory[];
  isLoading: boolean;
  error: string | null;
}

interface BoardContextValue extends BoardState {
  loadCategories: () => Promise<void>;
  loadPosts: (category?: string) => Promise<void>;
  loadPost: (id: string) => Promise<void>;
  createPost: (postData: Partial<MockPost>) => Promise<MockPost>;
  updatePost: (id: string, postData: Partial<MockPost>) => Promise<MockPost>;
  deletePost: (id: string) => Promise<void>;
  toggleLike: (postId: string, userId: string) => Promise<MockPost>;
  addComment: (postId: string, commentData: { authorId: string; authorName: string; content: string }) => Promise<MockPost>;
  deleteComment: (postId: string, commentId: string) => Promise<MockPost>;
  searchPosts: (query: string, category?: string) => Promise<void>;
}

const BoardContext = createContext<BoardContextValue | null>(null);

type BoardAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_POSTS'; payload: MockPost[] }
  | { type: 'SET_CURRENT_POST'; payload: MockPost }
  | { type: 'SET_CATEGORIES'; payload: BoardCategory[] }
  | { type: 'ADD_POST'; payload: MockPost }
  | { type: 'UPDATE_POST'; payload: MockPost }
  | { type: 'REMOVE_POST'; payload: string }
  | { type: 'SET_ERROR'; payload: string };

const initialState: BoardState = {
  posts: [],
  currentPost: null,
  categories: [],
  isLoading: false,
  error: null,
};

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SET_POSTS':
      return { ...state, posts: action.payload, isLoading: false };
    case 'SET_CURRENT_POST':
      return { ...state, currentPost: action.payload, isLoading: false };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts], isLoading: false };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map((p) => (p.id === action.payload.id ? action.payload : p)),
        currentPost: state.currentPost?.id === action.payload.id ? action.payload : state.currentPost,
        isLoading: false,
      };
    case 'REMOVE_POST':
      return { ...state, posts: state.posts.filter((p) => p.id !== action.payload), isLoading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

interface BoardProviderProps {
  children: ReactNode;
}

export function BoardProvider({ children }: BoardProviderProps) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  const loadCategories = useCallback(async () => {
    const categories = await boardService.getCategories();
    dispatch({ type: 'SET_CATEGORIES', payload: categories });
  }, []);

  const loadPosts = useCallback(async (category?: string) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const posts = category
        ? await boardService.getPostsByCategory(category)
        : await boardService.getAllPosts();
      dispatch({ type: 'SET_POSTS', payload: posts });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const loadPost = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const post = await boardService.getPostById(id);
      dispatch({ type: 'SET_CURRENT_POST', payload: post });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const createPost = useCallback(async (postData: Partial<MockPost>) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const post = await boardService.createPost(postData);
      dispatch({ type: 'ADD_POST', payload: post });
      return post;
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const updatePost = useCallback(async (id: string, postData: Partial<MockPost>) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const post = await boardService.updatePost(id, postData);
      dispatch({ type: 'UPDATE_POST', payload: post });
      return post;
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const deletePost = useCallback(async (id: string) => {
    await boardService.deletePost(id);
    dispatch({ type: 'REMOVE_POST', payload: id });
  }, []);

  const toggleLike = useCallback(async (postId: string, userId: string) => {
    try {
      const post = await boardService.toggleLike(postId, userId);
      dispatch({ type: 'UPDATE_POST', payload: post });
      return post;
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const addComment = useCallback(async (postId: string, commentData: { authorId: string; authorName: string; content: string }) => {
    try {
      const post = await boardService.addComment(postId, commentData);
      dispatch({ type: 'UPDATE_POST', payload: post });
      return post;
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const deleteComment = useCallback(async (postId: string, commentId: string) => {
    try {
      const post = await boardService.deleteComment(postId, commentId);
      dispatch({ type: 'UPDATE_POST', payload: post });
      return post;
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const searchPosts = useCallback(async (query: string, category?: string) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const posts = await boardService.searchPosts(query, category);
      dispatch({ type: 'SET_POSTS', payload: posts });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  return (
    <BoardContext.Provider
      value={{ ...state, loadCategories, loadPosts, loadPost, createPost, updatePost, deletePost, toggleLike, addComment, deleteComment, searchPosts }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard(): BoardContextValue {
  const context = useContext(BoardContext);
  if (!context) throw new Error('useBoard must be used within BoardProvider');
  return context;
}
