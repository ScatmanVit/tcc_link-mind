import axios from 'axios'
import {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";

type resToken = {
		message: string
}
interface AuthContextType {
	access_token: string | null;
	emailUser: string | null;
	logout: () => void;
	login: (token: string, email: string) => void;
	refresh_token: (userId: string) => Promise<resToken>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [access_token, setToken] = useState<string | null>(null);
	const [emailUser, setEmail] = useState<string | null>(null);

	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		if (storedToken) {
			setToken(storedToken);
		}
	}, []);

	function login(newToken: string) {
		localStorage.setItem("access_token", newToken);
		setToken(newToken);
	};

	function logout(){
		localStorage.removeItem("access_token");
		setToken(null);
		setEmail(null);
	};

	async function refresh_token(userId: string): Promise<resToken> {
		if (!userId) {
			console.error("Por favor forneça o Id")
			throw new Error("Id não fornecido para solicitar novo token de acesso.")
		}
		try {
			const refreshToken = await axios.post(
				"http://localhost:3000/api/v1/linkmind/auth/refresh-token",
				{  userId, platform: "web" },
				{ withCredentials: true }
			)
			if (refreshToken.data?.success && refreshToken.data.access_token) {
				const newToken = refreshToken.data.access_token;
				login(newToken);
				return { message: "Sessão renovada com sucesso!" };
			} else {
				console.error("API não retornou um novo token de acesso:", refreshToken.data);
				throw new Error(refreshToken.data.error || "A API não conseguiu renovar a sessão.");
			}
		} catch (err: any) {
			if (err.response?.data?.error) {
				console.error(err.response.data.error || "Deu ruim aqui")
				throw new Error(err.response.data.error || "Não foi possível solicitar um novo token de acesso")
			}
			if (err instanceof Error) {
				throw err
			} else {
				throw new Error("Erro desconhecido ao solicitar novo token")
			}
		}
	}

	const value = { access_token, emailUser, login, logout, refresh_token };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth deve ser usado dentro de um AuthProvider");
	}
	return context;
}
