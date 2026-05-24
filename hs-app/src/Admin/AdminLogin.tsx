import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (login === import.meta.env.VITE_ADMIN_LOGIN && password === import.meta.env.VITE_ADMIN_PASSWORD) {
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin');
        } else {
            setError('Неверный логин или пароль');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-900">
            <div className="bg-stone-800/50 p-8 rounded-2xl border border-white/10 w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6">Вход в админку</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-2">Логин</label>
                        <input
                            type="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="w-full px-4 py-2 bg-stone-900 border border-white/10 rounded-lg text-white"
                            placeholder="Введите логин"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-stone-900 border border-white/10 rounded-lg text-white"
                            placeholder="Введите пароль"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
                    >
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
}