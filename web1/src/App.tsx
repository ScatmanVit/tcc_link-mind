import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";
import UsersPage from '@/features/users/UsersPage'
import ResetPasswordPage from '@/auth/reset-password/ResetPasswordPage'

// Wrapper para proteger rotas que requerem autenticação
function RequireAuth({ children }: { children: JSX.Element }) {
  const { token } = useAuth()
  // Se não houver token, redireciona para a página de login
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Componente principal do App com o AuthProvider envolvendo as rotas
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/users" element={<RequireAuth><UsersPage /></RequireAuth>} />
        {/* Redireciona qualquer outro caminho para a página principal de usuários */}
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

// O componente raiz que inclui o AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
