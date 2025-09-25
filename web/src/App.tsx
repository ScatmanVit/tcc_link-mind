import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";
import { jwtDecode } from "jwt-decode";
import UsersPage from '@/pages/UsersPage'
import ResetPasswordPage from '@/auth/ResetPassword'
import { useEffect, useState } from "react";

/*  Aqui vou fazer a validação do token para sempre ter certeza de que tenho o access
	token válido e que se o access token tiver expirado, irei chamar a rota refresh-token para
	sempre passar o token válido para as rotas privadas não importa o que aconteça.

	- utilizar buffer para sempre verificar 30 segundos antes da expiração do token
	  	e não correr o risco de não conseguir renovar o acces token
		
	- fazer uma função utilitária no context/AuthContext para 
	  	chamadas para api e tratar respostas, guardar o token novo, e retornar o token novo para acesso normal

	- caso o refresh-token tenha expirado redirecionar para o login com mensagem
	    de "Sessão expirada" amigável
*/
type tokenBody = {
	id: string,
	email: string,
	role: string,
	exp: number
}

function RequireAuth({ children }: {  children: JSX.Element }) {
	const { access_token, refresh_token } = useAuth()
		console.log("AAAAA")
		if (!access_token) {
			 <Navigate to="/login" replace />
		}

	useEffect(() => {
		async function verifyToken() {
			const tokenDecoded = jwtDecode<tokenBody>(String(access_token))
			if (tokenDecoded && tokenDecoded.id) {
				try {
					const res = await refresh_token(tokenDecoded.id)
					if (res?.message) {
						console.error(res.message || "Ta faltando mensagem de erro, mas deu erro")
					}
				} catch (err: any) {
					if(err?.message) {
						console.error(err.message || "Não foi possível fazer o que tu pediu")
						return null
					}
				}
			} else {
				console.error("Falha ao decodificar o token")
			}
		}
		verifyToken()
	}, [access_token])
	return children
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
