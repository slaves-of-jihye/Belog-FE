import React, { createContext, useReducer, useCallback, useContext, useEffect, ReactNode } from 'react';
import { deadlineService } from '../../shared/api/deadlineService';
import { MockDeadline } from '../../shared/lib/mockData';
import { useAuth } from '../../entities/user/model/AuthProvider';

interface DeadlineState {
  deadlines: MockDeadline[];
  upcomingDeadlines: MockDeadline[];
  isLoading: boolean;
  error: string | null;
}

interface DeadlineContextValue extends DeadlineState {
  loadDeadlines: () => Promise<void>;
  loadUpcoming: (days?: number) => Promise<void>;
  createDeadline: (data: Omit<MockDeadline, 'id' | 'completed'>) => Promise<MockDeadline>;
  toggleComplete: (id: string) => Promise<void>;
  deleteDeadline: (id: string) => Promise<void>;
}

const DeadlineContext = createContext<DeadlineContextValue | null>(null);

type DeadlineAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_DEADLINES'; payload: MockDeadline[] }
  | { type: 'SET_UPCOMING'; payload: MockDeadline[] }
  | { type: 'ADD_DEADLINE'; payload: MockDeadline }
  | { type: 'UPDATE_DEADLINE'; payload: MockDeadline }
  | { type: 'REMOVE_DEADLINE'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'SET_ERROR'; payload: string };

const initialState: DeadlineState = {
  deadlines: [],
  upcomingDeadlines: [],
  isLoading: false,
  error: null,
};

function deadlineReducer(state: DeadlineState, action: DeadlineAction): DeadlineState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SET_DEADLINES':
      return { ...state, deadlines: action.payload, isLoading: false };
    case 'SET_UPCOMING':
      return { ...state, upcomingDeadlines: action.payload, isLoading: false };
    case 'ADD_DEADLINE':
      return { ...state, deadlines: [...state.deadlines, action.payload], isLoading: false };
    case 'UPDATE_DEADLINE': {
      const updated = action.payload;
      return {
        ...state,
        deadlines: state.deadlines.map((d) => (d.id === updated.id ? updated : d)),
        upcomingDeadlines: state.upcomingDeadlines
          .map((d) => (d.id === updated.id ? updated : d))
          .sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }),
        isLoading: false,
      };
    }
    case 'REMOVE_DEADLINE':
      return {
        ...state,
        deadlines: state.deadlines.filter((d) => d.id !== action.payload),
        upcomingDeadlines: state.upcomingDeadlines.filter((d) => d.id !== action.payload),
      };
    case 'CLEAR':
      return initialState;
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

interface DeadlineProviderProps {
  children: ReactNode;
}

export function DeadlineProvider({ children }: DeadlineProviderProps) {
  const [state, dispatch] = useReducer(deadlineReducer, initialState);
  const { user, isLoading: authLoading } = useAuth();

  const loadDeadlines = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const deadlines = await deadlineService.getAll();
      dispatch({ type: 'SET_DEADLINES', payload: deadlines });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const loadUpcoming = useCallback(async (days = 3) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const upcoming = await deadlineService.getUpcoming(days);
      dispatch({ type: 'SET_UPCOMING', payload: upcoming });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const createDeadline = useCallback(async (data: Omit<MockDeadline, 'id' | 'completed'>) => {
    try {
      const deadline = await deadlineService.create(data);
      dispatch({ type: 'ADD_DEADLINE', payload: deadline });
      const upcoming = await deadlineService.getUpcoming(3);
      dispatch({ type: 'SET_UPCOMING', payload: upcoming });
      return deadline;
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const toggleComplete = useCallback(async (id: string) => {
    try {
      const updated = await deadlineService.toggleComplete(id);
      dispatch({ type: 'UPDATE_DEADLINE', payload: updated });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const deleteDeadline = useCallback(async (id: string) => {
    try {
      await deadlineService.delete(id);
      dispatch({ type: 'REMOVE_DEADLINE', payload: id });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      loadDeadlines();
      loadUpcoming(3);
    } else {
      dispatch({ type: 'CLEAR' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  return (
    <DeadlineContext.Provider
      value={{ ...state, loadDeadlines, loadUpcoming, createDeadline, toggleComplete, deleteDeadline }}
    >
      {children}
    </DeadlineContext.Provider>
  );
}

export function useDeadline(): DeadlineContextValue {
  const context = useContext(DeadlineContext);
  if (!context) throw new Error('useDeadline must be used within DeadlineProvider');
  return context;
}
