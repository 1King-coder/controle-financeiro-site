import React, {useState, ReactNode, useEffect} from 'react';
import { AuthContext } from '../../config/AuthContext';
import { UsuarioAuth } from '../../types/Auth';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../services/useAuth';

interface AuthProviderProps {
  children: ReactNode
}

interface ProtectedRouteProps {
  children: ReactNode;
}

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#666'
  }}>
    Carregando...
  </div>
);

// Local storage key for user data
const USER_STORAGE_KEY = 'auth_user';

// Function to load user from localStorage
const loadUserFromStorage = (): UsuarioAuth | null => {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Validate that the user object has the required properties
      if (user && user.id && user.username && user.email !== undefined && user.isAuthenticated !== undefined) {
        return user;
      }
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
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
    console.error('Error saving user to localStorage:', error);
  }
};

// Protected Route Component
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const history = useHistory();
  
  if (!user || !user.isAuthenticated) {
    history.replace('/login');
    return null;
  }
  
  return <>{children}</>;
};

export default function AuthProvider ({children}: AuthProviderProps) {
  // Initialize state with user from localStorage
  const [user, setUser] = useState<UsuarioAuth | null>(() => loadUserFromStorage());
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
        }
      }
      setIsLoading(false);
    };

    validateSession();
  }, []);

  // Function to logout user
  const logout = () => {
    setUser(null);
    // Clear any other auth-related data
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  // Function to check if user session is still valid
  const checkSessionValidity = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // You can add an API call here to verify the session is still valid
      // For now, we'll just check if the user data exists and is authenticated
      return user.isAuthenticated === true;
    } catch (error) {
      console.error('Error checking session validity:', error);
      return false;
    }
  };

  // Show loading while checking session
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      logout,
      checkSessionValidity 
    }}>
      {children}
    </AuthContext.Provider>
  );
}