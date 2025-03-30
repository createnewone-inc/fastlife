// src/context/AuthContext.tsx
import { createContext, useContext, FC, ReactNode, useState, useEffect } from 'react';

interface User {
  displayName: string;
  email: string;
  photoURL: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // 必要なプロパティが全て存在するか確認
        if (parsedUser.displayName && parsedUser.email && parsedUser.photoURL) {
          return parsedUser;
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        console.log('Saving user to localStorage:', user); // デバッグ用
        localStorage.setItem('auth_user', JSON.stringify(user));
      } else {
        console.log('Removing user from localStorage'); // デバッグ用
        localStorage.removeItem('auth_user');
      }
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }, [user]);

  const handleSetUser = (newUser: User | null) => {
    console.log('Setting new user:', newUser); // デバッグ用
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser }}>
      {children}
    </AuthContext.Provider>
  );
};
