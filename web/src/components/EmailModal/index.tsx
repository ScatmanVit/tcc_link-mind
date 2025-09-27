import "./style.css";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";
import emailSend from "@/services/sendEmail";


export default function EmailModal({ open, onClose, user, access_token }: {
	open: boolean,
	onClose: () => void,
	user: any | null,
	access_token: string | null
}) {
	const [subject, setSubject] = useState("Comunicado Link Mind");
	const [message, setMessage] = useState("Olá!");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (open) {
			setSubject("Mensagem do ERP Veloz");
			setMessage(`Olá, ${user?.name || "usuário"}!`);
		}
	}, [open, user]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		if (access_token) {
			try {
				const res = await emailSend({
					name: user.name,
					email: user.email, 
					message, 
					subject, 
					access_token
				})
				if (res.message) {
					console.log(res.message, "asdsa")
					setLoading(false)
				}
			} catch (err: any) {
					console.error(err.message || "Erro ao enviar o email")
					console.log(err.message.includes("Network Error") && "Erro de internet, ou servidor esta indisponível no momento. Verifique a sua internet.")				
					console.log(err.message.includes("You can only send testing emails to your own email address") && "O domínio de email do remetente não é válido")
			} finally {
				setLoading(false)
			}
		} else {
			console.error("Forneça o access token POR FAVOR")
		}
		setLoading(false);
		onClose();
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={user ? `Email para ${user.name}` : "Email"}
		>
			<form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
				<Input
					label="Assunto"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
				/>
				<label className="field">
					<div className="label">Mensagem</div>
					<textarea
						className="input"
						rows={6}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
				</label>
				<div className="row" style={{ justifyContent: "flex-end" }}>
					<Button className="ghost" type="button" onClick={onClose}>
						Cancelar
					</Button>
					<Button type="submit" loading={loading}>
						Enviar
					</Button>
				</div>
			</form>
		</Modal>
	);
}
