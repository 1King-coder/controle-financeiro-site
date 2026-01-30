import React, { useState, ReactNode, useEffect } from "react";
import { AuthContext } from "../../config/AuthContext";
import { UsuarioAuth } from "../../types/Auth";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../services/useAuth";
import { googleLogout } from "@react-oauth/google";
import axiosInstance from "../../services/axios";
import { toast } from "react-toastify";

interface AuthProviderProps {
  children: ReactNode;
}

interface ProtectedRouteProps {
  children: ReactNode;
}

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "18px",
      color: "#666",
    }}
  >
    Carregando...
  </div>
);

// Local storage key for user data
const USER_STORAGE_KEY = "auth_user";

// Function to load user from localStorage
const loadUserFromStorage = (): UsuarioAuth | null => {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Validate that the user object has the required properties
      if (
        user &&
        user.id &&
        user.username &&
        user.email !== undefined &&
        user.isAuthenticated !== undefined &&
        user.hasSubscription !== undefined &&
        user.accessToken &&
        user.refreshToken &&
        user.expiresIn !== undefined &&
        user.tokenType
      ) {
        return user;
      }
    }
  } catch (error) {
    console.error("Error loading user from localStorage:", error);
  }
  return null;
};

// Function to save user to localStorage
const saveUserToStorage = (user: UsuarioAuth | null): void => {
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch (error) {
    console.error("Error saving user to localStorage:", error);
  }
};

// Protected Route Component
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const history = useHistory();

  if (!user || !user.isAuthenticated) {
    history.replace("/login");
    return null;
  }

  return <>{children}</>;
};

export const OnlySubscribersRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const history = useHistory();

  if (!user || !user.isAuthenticated) {
    history.replace("/login");
    return null;
  }

  if (!user.hasSubscription) {
    history.replace("/assinatura");
    return null;
  }

  return <>{children}</>;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  // Initialize state with user from localStorage
  const [user, setUser] = useState<UsuarioAuth | null>(() =>
    loadUserFromStorage(),
  );
  const [isLoading, setIsLoading] = useState(true);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    saveUserToStorage(user);
  }, [user]);

  // Check session validity on app startup
  useEffect(() => {
    const validateSession = async () => {
      if (user) {
        const isValid = await checkSessionValidity();

        if (!isValid) {
          setUser(null);
          localStorage.removeItem(USER_STORAGE_KEY);
          setIsLoading(false);
          return;
        }

        const userFromDB: {
          data: {
            id: string;
            username: string;
            StripeSubscriptionActive: boolean;
          };
        } = await axiosInstance.get(`/usuarios/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        if (userFromDB.data.StripeSubscriptionActive !== user.hasSubscription) {
          setUser({
            ...user,
            hasSubscription: userFromDB.data.StripeSubscriptionActive,
          });
          localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify({
              user,
            }),
          );
        }
      }
      setIsLoading(false);
    };

    validateSession().then(() => {});
  }, [setUser, user]);

  const checkSessionValidity = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      let result = true;
      try {
        const response = await axiosInstance.get("/usuarios/validate-token", {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        if (response.status === 200) {
          result = true;
        }
      } catch (error: any) {
        if (error.response.status === 400) {
          toast.error("Usuário não autenticado");
          result = false;
        }

        if (error.response.status === 401) {
          try {
            const refreshResponse = await axiosInstance.post(
              "/usuarios/refresh-token",
              {
                refreshToken: user.refreshToken,
              },
            );
            const { accessToken, refreshToken, expiresIn, tokenType } =
              refreshResponse.data;

            setUser({
              ...user,
              accessToken,
              refreshToken,
              expiresIn,
              tokenType,
            });

            result = true;
          } catch (error) {
            toast.error("Sessão expirada. Faça login novamente.");
            result = false;
          }
        }
      }

      return result;
    } catch (error) {
      console.error("Error checking session validity:", error);
      return false;
    }
  };

  // Function to logout user
  const logout = () => {
    // Clear any other auth-related data
    axiosInstance
      .post("/usuarios/logout", { refreshToken: user!.refreshToken })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
    setUser(null);

    localStorage.removeItem(USER_STORAGE_KEY);
    googleLogout();
  };

  // Function to check if user session is still valid

  // Show loading while checking session
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        checkSessionValidity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
