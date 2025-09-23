'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);
  const { setAuth } = useContext(AuthContext);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', isError: false });

    try {
      const response = await api.post('/api/auth/login/', formData);

      // Сохраняем данные аутентификации
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('username', formData.username);

      // Обновляем глобальное состояние
      setAuth({
        username: formData.username,
        access: response.data.access,
        refresh: response.data.refresh,
        isAuthenticated: true
      });

      // Показываем успешное сообщение на короткое время перед редиректом
      setMessage({ text: 'Вход выполнен успешно!', isError: false });
      setTimeout(() => router.push('/cryptos/'), 1000);

    } catch (error) {
      const errorMessage = error.response?.data?.detail ||
                         error.response?.data?.message ||
                         'Произошла ошибка при входе';
      setMessage({ text: `Ошибка: ${errorMessage}`, isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Вход в систему</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Логин</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Логин"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Пароль</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {message.text && (
            <div className={`rounded-md p-4 ${message.isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message.text}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Вход...
                </span>
              ) : 'Войти'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">Ещё нет аккаунта? </span>
          <a
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Зарегистрироваться
          </a>
        </div>
      </div>
    </div>
  );
}