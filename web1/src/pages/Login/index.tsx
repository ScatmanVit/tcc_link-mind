import "./style.css";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simula um atraso de chamada de API
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Este é o lugar onde você colocaria sua chamada de API real
    if (email === "banana@gmail.com" && password === "123123123") {
      // Em caso de sucesso, salve o token e navegue
      login("fake-token-from-api", email);
      navigate("/users", { replace: true });
      console.log("login bem-sucedido!")
    } else {
      // Em caso de falha, mostre um erro
      console.error("Deu errado")
      setError("Credenciais inválidas");
    }

    setLoading(false);
  };

  let canSubmit
  if (email && password) {
     canSubmit = email?.includes("@") && password.length >= 3;
  }

  return (
    <div
      className="container"
      style={{ display: "grid", placeItems: "center", minHeight: "100%" }}
    >
      <form onSubmit={handleSubmit} className="card login-card">
        <div className="toolbar">
          <div className="title brand">ERP Veloz</div>
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
          <Button type="submit" disabled={!canSubmit} loading={loading}>
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
          Use admin seed: admin@erp.local / admin123
        </div>
      </form>
    </div>
  );
}
