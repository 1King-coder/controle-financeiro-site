import React, {useState, ReactNode} from 'react';
import { AuthContext } from '../../config/AuthContext';
import { UsuarioAuth } from '../../types/Auth';

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider ({children}: AuthProviderProps) {

  const [user, setUser] = useState<UsuarioAuth  | null>(null);


  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}