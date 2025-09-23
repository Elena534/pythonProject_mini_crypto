// components/Navbar.js
'use client'
import Link from 'next/link'
import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/AuthContext'

export default function Navbar() {
  const { auth, setAuth } = useContext(AuthContext)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('username')
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setAuth({ username: null, access: null, refresh: null })
    router.push('/login')
  }

  // Стили (оставлены ваши оригинальные стили)
  const logoutButtonStyle = {
    padding: '8px 16px',
    background: 'linear-gradient(45deg, #ff0000, #800000)',
    color: '#fff',
    border: '3px solid #fff',
    borderRadius: '4px',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    cursor: 'pointer',
    boxShadow: '2px 2px 0px #fff',
    transition: 'all 0.2s ease-in-out',
  }

  const buttonHover = (color) => ({
    background: `linear-gradient(45deg, ${color.dark}, ${color.light})`,
    boxShadow: '4px 4px 0px #0ff',
    transform: 'translateY(-2px)'
  })

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      background: '#111',
      color: '#0ff',
      fontFamily: 'monospace',
      boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
    }}>
      <Link href='/cryptos' style={{
        color: '#0ff',
        fontWeight: 'bold',
        fontSize: '30px',
        textDecoration: 'none'
      }}>
        CRYPTO
      </Link>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {auth.username ? (
          <>
            <span style={{
              fontWeight: 'bold',
              color: '#da3a08',
              fontSize: '20px'
            }}>
              {auth.username}
            </span>

            <button
              onClick={() => router.push('/favorites')}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(45deg, #00ff00, #008000)',
                color: '#111',
                border: '3px solid #0ff',
                borderRadius: '4px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                boxShadow: '2px 2px 0px #0ff',
                transition: 'all 0.2s ease-in-out',
              }}
              onMouseEnter={(e) => Object.assign(e.target.style, buttonHover({ light: '#00ff00', dark: '#008000' }))}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(45deg, #00ff00, #008000)'
                e.target.style.boxShadow = '2px 2px 0px #0ff'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              Избранное
            </button>

            <button
              style={logoutButtonStyle}
              onClick={handleLogout}
              onMouseEnter={(e) => Object.assign(e.target.style, buttonHover({ light: '#ff0000', dark: '#800000' }))}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(45deg, #ff0000, #800000)'
                e.target.style.boxShadow = '2px 2px 0px #fff'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '6px 12px',
                background: '#ff0000',
                color: '#fff',
                border: '2px solid #fff',
                borderRadius: '4px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                Вход
              </button>
            </Link>
            <Link href="/register" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '6px 12px',
                background: 'transparent',
                color: '#ff0000',
                border: '2px solid #ff0000',
                borderRadius: '4px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                Регистрация
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}