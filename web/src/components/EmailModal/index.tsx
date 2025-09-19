import "./style.css";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";

export default function EmailModal({ open, onClose, user }: {
	open: boolean;
	onClose: () => void;
	user: any | null;
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
		console.log("Enviando email (simulado):", {
			userId: user?.id,
			subject,
			message,
		});
		await new Promise((resolve) => setTimeout(resolve, 700))
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
