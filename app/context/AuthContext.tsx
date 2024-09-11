import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (username: string, password: string) => Promise<any>;
  onLogin?: (username: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "token";
export const API_URL = "https://be-suwit.ruhyadi.com";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({ token: null, authenticated: null });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({ token, authenticated: true });
      } else {
        setAuthState({ token: null, authenticated: false });
      }
    };
  }, []);

  const register = async (username: string, password: string) => {
    try {
      return await axios.post(`${API_URL}/api/v1/users`, {
        username,
        password,
      });
    } catch (e) {
      return { error: true, msg: (e as any).response.data.message };
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
        username,
        password,
      });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, response.data.access_token);
      setAuthState({ token: response.data.access_token, authenticated: true });
    } catch (e) {
      return { error: true, msg: (e as any).response.data.message };
    }
  };

  const logout = async () => {
    axios.defaults.headers.common["Authorization"] = "";

    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthState({ token: null, authenticated: false });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
