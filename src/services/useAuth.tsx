import { useContext } from "react";
import { AuthContext, GoogleAuthContext } from "../config/AuthContext";
import { AuthContextType, GoogleAuthContextType } from "../types/Auth";

// The custom hook that simplifies consuming the context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  // This hook should only be used within an AuthProvider
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const useGoogleAuth = (): GoogleAuthContextType => {
  const context = useContext(GoogleAuthContext);

  if (!context) {
    throw new Error("useGoogleAuth must be used within a GoogleAuthProvider");
  }

  return context;
};
