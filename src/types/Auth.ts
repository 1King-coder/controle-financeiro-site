import { Dispatch, SetStateAction } from 'react';

export type UsuarioAuth = {
  username: string,
  email: string,
  id: number,
  isAuthenticated: boolean
}

export interface AuthContextType {
  user: UsuarioAuth | null;
  setUser: Dispatch<SetStateAction<UsuarioAuth | null>>;
  logout: () => void;
  checkSessionValidity: () => Promise<boolean>;
}