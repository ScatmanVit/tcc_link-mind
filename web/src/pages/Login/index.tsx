import "./style.css";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { login } = useAuth();
	const navigate = useNavigate();


	async function loginUser(email: string, password: string) {
		try {
			const res = await axios.post(
				"http://localhost:3000/api/v1/linkmind/auth/login",
				{ email, password, platform: "web" }
			);

			const access_token = res.data.access_token;
			const errorMessage = res.data.error || res.data.message || null;

			if (access_token) {
				login(access_token, email);
				return null; 
			} else {
				return errorMessage || "Login falhou";
			}
		} catch (err: any) {
			if (err.response) {
				return err.response.data.error || "Erro no login";
			} else {
				return err.message || "Erro desconhecido";
			}
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		if (!email.includes("@")) {
			setError("Por favor insira um email válido");
			setLoading(false);
			return;
		}
		const errorMessage = await loginUser(email, password);
		if (errorMessage) {
			setError(errorMessage);
		} else {
			navigate("/users", { replace: true });
		}

		setLoading(false);
	};

	return (
		<div
			className="container"
			style={{ display: "grid", placeItems: "center", minHeight: "100%" }}
		>
			<form noValidate onSubmit={handleSubmit} className="card login-card">
				<div className="toolbar">
					<div className="title brand">Link Mind | ADM</div>
				</div>
				<div style={{ display: "grid", gap: 12, padding: 12 }}>
					<Input
						label="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						label="Senha"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{error && (
						<div className="tag gray" role="alert">
							{error}
						</div>
					)}
					<Button type="submit" loading={loading} disabled={loading}>
						Entrar
					</Button>
				</div>
				<div
					style={{
						padding: "0 12px 12px",
						color: "var(--muted)",
						fontSize: 12,
					}}
				>
					Seja bem-vindo de volta!
				</div>
			</form>
		</div>
	);
}
