import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import "./reset-password.css";

function ResetPasswordPage() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token") || "";

	const [newPassword, setNewPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage("");

		if (!newPassword || !confirmPassword) {
			setMessage("Preencha todos os campos.");
			return;
		}
		if (newPassword !== confirmPassword) {
			setMessage("As senhas não coincidem.");
			return;
		}

		setLoading(true);

		try {
			const response = await axios.post(
				"http://localhost:3000/api/v1/linkmind/auth/reset-password",
				{ token, newPassword },
				{ timeout: 5000 }
			);

			setMessage(response.data.message || "Senha redefinida com sucesso!");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error: any) {
			console.error(error)
			if (axios.isAxiosError(error)) {
				setMessage(error.response?.data?.error || "Erro ao redefinir senha.");
			} else {
				setMessage("Erro inesperado ao redefinir senha.");
			}
		} finally {
			setLoading(false);
		}
	};

	const isSuccess = message.toLowerCase().includes("sucesso");

	return (
		<div className="container" style={{ display: 'grid', placeItems: 'center', minHeight: '100%' }}>
			<div className="card reset-password-card">
				<div className="toolbar"><div className="title brand">Redefinir Senha</div></div>
				<form onSubmit={handleSubmit} className="reset-password-form">
					<Input
						label="Nova senha"
						type="password"
						placeholder="Digite a nova senha"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						disabled={loading}
					/>
					<Input
						label="Confirmar nova senha"
						type="password"
						placeholder="Confirme a nova senha"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						disabled={loading}
					/>
					<Button
						type="submit"
						disabled={loading}
						loading={loading}
					>
						Redefinir Senha
					</Button>
				</form>
				{message && (
					<div
						className={`tag ${isSuccess ? "green" : "gray"}`}
						style={{ marginTop: 12 }}
						role="alert"
					>
						{message}
					</div>
				)}
			</div>
		</div>
	);
};

export default ResetPasswordPage;