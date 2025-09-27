import axios from 'axios';
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { jwtDecode } from "jwt-decode";

type TokenBody = {
  id: string;
  email: string;
  role: string;
  exp: number;
};

type ResToken = {
  message: string;
};

interface AuthContextType {
  access_token: string | null;
  login: (userId: string, newToken: string) => void;
  logout: () => void;
  refresh_token_func: (userId: string) => Promise<ResToken>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [access_token, setToken] = useState<string | null>(null);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Carrega token do localStorage ao iniciar
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      setToken(token);
      scheduleTokenRefresh(token, userId);
    }
    return () => clearTimeoutIfExists();
  }, []);

  function clearTimeoutIfExists() {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }

  function login(userId: string, newToken: string) {
    localStorage.setItem("access_token", newToken);
    localStorage.setItem("userId", userId);
    setToken(newToken);
    scheduleTokenRefresh(newToken, userId);
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userId");
    setToken(null);
    clearTimeoutIfExists();
  }

  async function refresh_token_func(userId: string): Promise<ResToken> {
    if (!userId) throw new Error("Id não fornecido para solicitar novo token.");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/linkmind/auth/refresh-token",
        { userId, platform: "web" },
        { withCredentials: true }
      );

      if (res.data?.success && res.data.access_token) {
        login(userId, res.data.access_token); // login agenda o refresh
        return { message: "Sessão renovada com sucesso!" };
      } else {
        throw new Error(res.data.error || "Não foi possível renovar a sessão");
      }
    } catch (err: any) {
      if (err.response?.data?.error) throw new Error(err.response.data.error);
      if (err instanceof Error) throw err;
      throw new Error("Erro desconhecido ao solicitar novo token");
    }
  }

  function scheduleTokenRefresh(token: string, userId: string) {
    const decoded: TokenBody = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    // 30s antes do expirar
    let delay = (decoded.exp - currentTime - 30) * 1000;

    // nunca menos de 1 segundo para evitar refresh instantâneo
    if (delay < 1000) delay = 1000;

    clearTimeoutIfExists();

    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        await refresh_token_func(userId);
      } catch {
        logout();
      }
    }, delay);
  }

  return (
    <AuthContext.Provider value={{ access_token, login, logout, refresh_token_func }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
}
