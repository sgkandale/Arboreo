import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  username: string | null;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    userId: null,
    username: null,
  });

  const checkTokenExpiration = useCallback((token: string) => {
    try {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        // Token expired
        return false;
      }
      return true;
    } catch (error) {
      // Invalid token
      return false;
    }
  }, []);

  const login = useCallback((token: string) => {
    localStorage.setItem('token', token);
    const decodedToken: any = jwtDecode(token);
    setAuthState({
      isAuthenticated: true,
      token,
      userId: decodedToken.userId,
      username: decodedToken.username,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      token: null,
      userId: null,
      username: null,
    });
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && checkTokenExpiration(storedToken)) {
      const decodedToken: any = jwtDecode(storedToken);
      setAuthState({
        isAuthenticated: true,
        token: storedToken,
        userId: decodedToken.userId,
        username: decodedToken.username,
      });
    } else if (storedToken) {
      // Token exists but is expired, clear it
      logout();
    }
  }, [checkTokenExpiration, logout]);

  return { ...authState, login, logout };
};

export default useAuth;
