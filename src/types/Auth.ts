import { Dispatch, SetStateAction } from "react";

export type UsuarioAuth = {
  username: string;
  email: string;
  id: number;
  hasSubscription: boolean;
  isAuthenticated: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
};

export interface AuthContextType {
  user: UsuarioAuth | null;
  setUser: Dispatch<SetStateAction<UsuarioAuth | null>>;
  logout: () => void;
  checkSessionValidity: () => Promise<boolean>;
}

export interface GoogleAuthContextType {
  nome: string;
  sobrenome: string;
  username: string;
  email: string;
  googleId: number;
}
