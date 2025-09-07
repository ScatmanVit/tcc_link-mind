import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./reset-password.css";

const ResetPasswordPage: React.FC = () => {
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
                "https://tcc-link-mind.onrender.com/api/v1/linkmind/auth/reset-password",
                { token, newPassword },
                { timeout: 5000 }
            );

            setMessage(response.data.message || "Senha redefinida com sucesso!");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
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
        <div className="reset-password-container">
            <h2>Redefinir Senha</h2>
            <form onSubmit={handleSubmit} className="reset-password-form">
                <input
                    type="password"
                    placeholder="Nova senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="reset-password-input"
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="reset-password-input"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="reset-password-button"
                    disabled={loading}
                >
                    {loading ? "Redefinindo..." : "Redefinir Senha"}
                </button>
            </form>
            {message && (
                <p
                    className={`reset-password-message ${
                        isSuccess ? "success" : "error"
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default ResetPasswordPage;
