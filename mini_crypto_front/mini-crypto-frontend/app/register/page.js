'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../api/axios';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await api.post('/api/auth/register/', {
        username: formData.username,
        password: formData.password,
      });

      setMessage('Регистрация успешна! Перейдите на логин.');
      router.push('/login');
    } catch (err) {
      setMessage('Ошибка: ' + JSON.stringify(err.response?.data));
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          name="username"
          placeholder="Логин"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p style={{ color: 'red' }}>{message}</p>
    </div>
  );
}
