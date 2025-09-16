import {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";

interface AuthContextType {
	token: string | null;
	email: string | null;
	login: (token: string, email: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [email, setEmail] = useState<string | null>(null);

	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		const storedEmail = localStorage.getItem("email");
		if (storedToken) {
			setToken(storedToken);
		}
		if (storedEmail) {
			setEmail(storedEmail);
		}
	}, []);

	const login = (newToken: string, newEmail: string) => {
		localStorage.setItem("access_token", newToken);
		localStorage.setItem("email", newEmail);
		setToken(newToken);
		setEmail(newEmail);
	};

	const logout = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("email");
		setToken(null);
		setEmail(null);
	};

	const value = { token, email, login, logout };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth deve ser usado dentro de um AuthProvider");
	}
	return context;
}
