import axios from "axios";

type LoginAdm = {
	email: string,
	password: string,
	login: (access_token: string, email: string) => void
}
 
export default async function loginUser({ email, password, login }: LoginAdm) {
    try {
		const res = await axios.post(
			"http://localhost:3000/api/v1/linkmind/auth/login",
			{ email, password, platform: "web" }
		)

		const access_token = res.data.access_token;
		const errorMessage = res.data.error || res.data.message || null;

		if (access_token) {
			try {
				const isAdmin = await axios.post(
					"http://localhost:3000/api/v1/linkmind/check-admin",
					{},
					{
						headers: {
							Authorization: `Bearer ${access_token}`
						}
					}
				);

				console.log("Resposta check-admin:", isAdmin.data);
			} catch (err: any) {
				if (err.response?.data?.error) {
					console.log("Erro do servidor:", err.response.data.error);
					throw new Error(err.response.data.error);
				} else if (err instanceof Error) {
					throw err;
				} else {
					console.log("Erro desconhecido no login:", err);
					throw new Error("Erro desconhecido ao fazer login");
				}
			}
            
			login(access_token, email);
			console.log("Login bem-sucedido:", access_token, email);
			return null;
		} else {
			throw new Error(errorMessage || "Login falhou");
		}
	} catch (err: any) {
		if (err.response?.data?.error) {
			console.log("Erro do servidor:", err.response.data.error);
			throw new Error(err.response.data.error);
		}
		if (err instanceof Error) {
			console.log("Erro propagado:", err.message);
			throw err;
		}
		console.log("Erro desconhecido no login:", err);
		throw new Error("Erro desconhecido ao fazer login");
	}
}