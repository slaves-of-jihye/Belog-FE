import { createContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

const initialState = {
  user: null,
  isLoading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SET_USER':
      return { ...state, user: action.payload, isLoading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGOUT':
      return { ...state, user: null, isLoading: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      dispatch({ type: 'SET_USER', payload: user });
    });
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const user = await authService.login(email, password);
      dispatch({ type: 'SET_USER', payload: user });
      return user;
    } catch (err) {
      if (err.message === 'SESSION_EXPIRED') {
        dispatch({ type: 'LOGOUT' });
      } else {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      }
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const user = await authService.signup(name, email, password);
      dispatch({ type: 'SET_USER', payload: user });
      return user;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  };

  const logout = async () => {
    await authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}
