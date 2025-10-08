import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";
import { jwtDecode } from "jwt-decode";
import UsersPage from '@/pages/UsersPage'
import ResetPasswordPage from '@/auth/ResetPassword'
import { useEffect, useState } from "react";

type tokenBody = {
	id: string;
	email: string;
	role: string;
	exp: number;
};

function RequireAuth({ children }: { children: JSX.Element }) {
	const { access_token } = useAuth();
	const [status, setStatus] = useState<"loading" | "unauthorized" | "authorized">("loading");

	useEffect(() => {
		if (!access_token) {
			setStatus("unauthorized");
			return;
		}

		try {
			const decoded: tokenBody = jwtDecode(access_token);
			const currentTime = Math.floor(Date.now() / 1000);

			if (decoded.exp < currentTime) {
				// token já expirou
				setStatus("unauthorized");
			} else {
				setStatus("authorized");
			}
		} catch {
			setStatus("unauthorized");
		}
	}, [access_token]);

	if (status === "loading") return <div>Carregando...</div>;
	if (status === "unauthorized") return <Navigate to="/login" replace />;

	return children;
}




function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/reset-password" element={<ResetPasswordPage />} />
				<Route path="/users" element={<RequireAuth><UsersPage /></RequireAuth>} />
				<Route path="*" element={<Navigate to="/users" replace />} />
			</Routes>
		</BrowserRouter>
	)
}

export default function App() {
	return (
		<AuthProvider>
			<AppRoutes />
		</AuthProvider>
	);
}
