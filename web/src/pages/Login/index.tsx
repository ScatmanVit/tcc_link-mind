import "./style.css";
import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import loginUser from '@/services/admin/admin.login'

export default function Login() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [errorEmail, setErrorEmail] = useState(false)
	const [errorPassword, SetErrorPassword] = useState(false)
	const { login } = useAuth();
	const navigate = useNavigate();


	useEffect(() => {
		if (email != "" && password != "") {
			if(!email && !password) {
				setError("Por favor preencha todos os campos")
				setErrorEmail(true)
				SetErrorPassword(true)
				setLoading(false);
				return
			} 
			if (!email) {
				setError("Por favor insira um email.")
				setErrorEmail(true)
				setLoading(false);
				return
			} else {
				setErrorEmail(false)
				setError("")
			}
			if (!email.includes("@")) {
				setError("Por favor insira um email válido");
				setErrorEmail(true)
				SetErrorPassword(false)
				setLoading(false);
				return;
			} else {
				setErrorEmail(false)
				setError("")
			}
			if(!password) {
				setError("Por favor insira uma senha.")
				SetErrorPassword(true)
				setLoading(false);
				return
			} else {
				setError("")
				SetErrorPassword(false)
			}
			if (password.length < 8) {
				setError("A senha deve conter no mínimo 8 caracteres.")
				setLoading(false);
				SetErrorPassword(true)
				setErrorEmail(false)
				return
			} else {
				SetErrorPassword(false)
				setError("")
			}
		}
	}, [email, password])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			await loginUser({email, password, login});
			navigate("/users");
		} catch (err: any) {
			console.log("chegou a mensagem: ", err.message)
			setError(err.message);
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
						error={errorEmail}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						label="Senha"
						type="password"
						value={password}
						error={errorPassword}
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
