'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f, #222)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#0ff',
      fontFamily: 'monospace',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '64px', letterSpacing: '4px' }}>BRUTAL CRYPTO</h1>
      <p style={{ fontSize: '20px', margin: '20px 0' }}>
        Добро пожаловать в брутальный мир криптовалют
      </p>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link href="/login">
          <button style={{
            padding: '10px 20px',
            background: '#ff0000',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '4px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>Войти</button>
        </Link>
        <Link href="/register">
          <button style={{
            padding: '10px 20px',
            background: 'transparent',
            color: '#ff0000',
            border: '2px solid #ff0000',
            borderRadius: '4px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>Регистрация</button>
        </Link>
      </div>
    </div>
  );
}
