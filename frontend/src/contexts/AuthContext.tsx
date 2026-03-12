import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, type User } from '@/lib/authService';
import { subscriptionService } from '@/lib/subscriptionService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isPremium = user?.subscription_plan === 'premium' && user?.subscription_status === 'active';

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      const storedUser = authService.getUser();
      if (storedUser && authService.isAuthenticated()) {
        // Verify token is still valid
        const isValid = await authService.verifyToken();
        if (isValid) {
          setUser(storedUser);
          // Refresh subscription status
          try {
            await refreshSubscription();
          } catch (error) {
            console.error('Failed to refresh subscription:', error);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.user);
  };

  const register = async (email: string, username: string, password: string) => {
    const response = await authService.register(email, username, password);
    setUser(response.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshSubscription = async () => {
    try {
      const subscriptionData = await subscriptionService.getStatus();
      const currentUser = authService.getUser();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          subscription_plan: subscriptionData.subscription_plan,
          subscription_status: subscriptionData.subscription_status,
          subscribed_at: subscriptionData.subscribed_at,
          subscription_expires_at: subscriptionData.subscription_expires_at,
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to refresh subscription:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isPremium,
        login,
        register,
        logout,
        refreshSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
