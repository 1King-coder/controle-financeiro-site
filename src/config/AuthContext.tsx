import { createContext } from "react";
import { AuthContextType, GoogleAuthContextType } from "../types/Auth";

export const AuthContext = createContext<AuthContextType | null>(null);
export const GoogleAuthContext = createContext<GoogleAuthContextType | null>(
  null,
);
