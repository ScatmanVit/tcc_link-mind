import axios from "axios";

type LoginAdm = {
	email: string,
	password: string,
	userId?: string,
	login: (idUser: string, access_token: string) => void
}
 
export default async function loginUser({ email, password, login }: LoginAdm) {
    let userId
	try {
		const res = await axios.post(
			"http://localhost:3000/api/v1/linkmind/auth/login",
			{ email, password, platform: "web" },
			{ withCredentials: true }
		)
 
		const access_token = res.data.access_token;
		const errorMessage = res.data.error || res.data.message || null;
		userId = res.data.userId

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
			} catch (err: any) {
				if (err.response?.data?.error) {
					throw new Error(err.response.data.error) || "Erro no servidor";
				} else if (err instanceof Error) {
					throw err;
				} else {
					throw new Error("Erro desconhecido ao fazer login");
				}
			}
            console.log(access_token)
			login(userId, access_token);
			return true
		} else {
			throw new Error(errorMessage || "Login falhou");
		}
	} catch (err: any) {
		if (err.response?.data?.error) {
			console.log("Erro do servidor:", err.response.data.error);
			throw new Error(err.response.data.error);
		}
		if (err instanceof Error) {
			throw err;
		}
		console.log("Erro desconhecido no login:", err);
		throw new Error("Erro desconhecido ao fazer login");
	}
}