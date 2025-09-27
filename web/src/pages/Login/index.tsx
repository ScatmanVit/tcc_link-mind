import "./style.css";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import loginUser from '@/services/admin/admin.login';

export default function Login() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [errorEmail, setErrorEmail] = useState(false);
	const [errorPassword, setErrorPassword] = useState(false);
	const { login, access_token } = useAuth();
	const navigate = useNavigate();

	if (access_token) {
  		return <Navigate to="/users" replace />;
	}

	const handleValidation = () => {
		setError(null);
		setErrorEmail(false);
		setErrorPassword(false);
		
		if (!email || !password) {
			setError("Por favor, preencha todos os campos.");
			setErrorEmail(!email);
			setErrorPassword(!password);
			return false;
		}

		if (!email.includes("@")) {
			setError("Por favor, insira um email válido.");
			setErrorEmail(true);
			return false;
		}

		if (password.length < 8) {
			setError("A senha deve conter no mínimo 8 caracteres.");
			setErrorPassword(true);
			return false;
		}

		return true;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const isValid = handleValidation();

		if (!isValid) {
			setLoading(false);
			return;
		}

		try {
			const res = await loginUser({ email, password, login });
			if (res) {
				navigate("/users");
			}
		} catch (err: any) {
			console.log("chegou a mensagem: ", err.message);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};
    
	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		if (error) handleValidation(); 
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		if (error) handleValidation(); 
	};

	return (
		<div
			className="container"
			style={{ display: "grid", placeItems: "center", minHeight: "100%"}}
		>
			<form noValidate onSubmit={handleSubmit} className="card login-card">
				<div className="toolbar">
					<div className="title brand">Link Mind | ADM</div>
				</div>
				<div style={{ display: "grid", gap: 16, padding: 11, marginBottom: -11, marginTop: 20 }}>
					<Input
						label="Email"
						type="email"
						value={email}
						error={errorEmail}
						onChange={handleEmailChange}
					/>
					<Input
						label="Senha"
						type="password"
						value={password}
						error={errorPassword}
						onChange={handlePasswordChange}
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
						color: "var(--muted)",
						fontSize: 12,
						display: "flex",
						justifyContent: "center"
					}}
				>
					Seja bem-vindo de volta!
				</div>
			</form>
		</div>
	);
}
