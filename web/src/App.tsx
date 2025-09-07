import { Route, Routes } from 'react-router-dom'
import ResetPasswordPage from './auth/reset-password/ResetPasswordPage';
import HomePage from './pages/HomePage';


function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
    );
}

export default App;
