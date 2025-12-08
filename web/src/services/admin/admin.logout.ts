import axios from 'axios'

type logoutType = {
    logout: () => void
}

export default async function logout_Admin({ logout }: logoutType ) {

    try {
        const res = await axios.post(
            "https://tcc-link-mind.onrender.com/api/v1/linkmind/auth/logout",
            { platform: "web" },
            { withCredentials: true }
        )
        if (res.data?.message) {
            logout()
            return { message: res.data.message || "Logout efetuado." }
        }
    } catch (err: any) {
		if (err.response?.data?.error) {
			throw new Error(err.response.data.error || "Erro no servidor" );
		}
		if (err instanceof Error) {
			throw err;
		}
		console.log("Erro desconhecido no logout:", err);
		throw new Error("Erro desconhecido ao fazer logout");
    }
}