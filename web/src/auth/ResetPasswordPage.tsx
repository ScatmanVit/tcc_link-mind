import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://tcc-link-mind.onrender.com/api/v1/linkmind/auth/reset-password', {
        token,
        newPassword,
      });
      setMessage(response.data.message || 'Senha redefinida com sucesso!');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Erro ao redefinir senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Redefinir Senha</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="password"
          placeholder="Nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Redefinindo...' : 'Redefinir Senha'}
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '15px',
    color: '#d9534f',
  },
};
