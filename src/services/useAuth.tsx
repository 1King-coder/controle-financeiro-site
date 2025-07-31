import { useContext } from 'react';
import { AuthContext } from '../config/AuthContext';
import { AuthContextType } from '../types/Auth'

// The custom hook that simplifies consuming the context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  // This hook should only be used within an AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};