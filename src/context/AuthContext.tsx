import React, { createContext, useContext, useReducer, type ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; user: User }
  | { type: 'LOGIN_ERROR'; error: string }
  | { type: 'LOGOUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { user: action.user, isLoading: false, error: null };
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false, error: action.error };
    case 'LOGOUT':
      return { user: null, isLoading: false, error: null };
    default:
      return state;
  }
}

// Demo credentials
const DEMO_USERS: Array<{ email: string; password: string; user: User }> = [
  {
    email: 'demo@solarshop.com',
    password: 'demo1234',
    user: { id: '1', name: 'Demo User', email: 'demo@solarshop.com' },
  },
  {
    email: 'admin@solarshop.com',
    password: 'admin1234',
    user: { id: '2', name: 'Admin', email: 'admin@solarshop.com' },
  },
];

interface AuthContextValue {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
    error: null,
  });

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    // Simulate network delay
    await new Promise((res) => setTimeout(res, 1200));

    const match = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (match) {
      dispatch({ type: 'LOGIN_SUCCESS', user: match.user });
    } else {
      dispatch({ type: 'LOGIN_ERROR', error: 'Invalid email or password.' });
    }
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

