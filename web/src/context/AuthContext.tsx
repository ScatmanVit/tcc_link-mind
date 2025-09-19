import {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";

interface AuthContextType {
	access_token: string | null;
	emailUser: string | null;
	login: (token: string, email: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [access_token, setToken] = useState<string | null>(null);
	const [emailUser, setEmail] = useState<string | null>(null);

	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		const storedEmail = localStorage.getItem("emailUser");
		if (storedToken) {
			setToken(storedToken);
		}
		if (storedEmail) {
			setEmail(storedEmail);
		}
	}, []);

	const login = (newToken: string, newEmail: string) => {
		localStorage.setItem("access_token", newToken);
		localStorage.setItem("emailUser", newEmail);
		setToken(newToken);
		setEmail(newEmail);
	};

	const logout = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("emailUser");
		setToken(null);
		setEmail(null);
	};

	const value = { access_token, emailUser, login, logout };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth deve ser usado dentro de um AuthProvider");
	}
	return context;
}
