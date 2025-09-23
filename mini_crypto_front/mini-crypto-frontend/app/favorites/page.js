'use client';
import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '@/context/AuthContext';
import AddFavoriteButton from './AddFavoriteButton';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/favorites/', {
          headers: {
            Authorization: `Bearer ${auth?.access}`
          }
        });
        setFavorites(res.data);
      } catch (err) {
        console.error('Ошибка загрузки избранного:', err);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.access) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [auth?.access]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/favorites/${id}/`, {
        headers: {
          Authorization: `Bearer ${auth?.access}`
        }
      });
      setFavorites(favorites.filter(f => f.id !== id));
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert('Не удалось удалить из избранного');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#111',
        color: '#0ff',
        fontSize: '20px'
      }}>
        ⏳ Загружаем избранное...
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: '#111',
      minHeight: '100vh',
      color: '#0ff'
    }}>
      <h2 style={{
        marginBottom: '20px',
        fontSize: '26px',
        borderBottom: '2px solid #0ff',
        paddingBottom: '10px',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        ⭐ Моё избранное
      </h2>

      {favorites.length === 0 ? (
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          fontSize: '18px',
          color: '#888'
        }}>
          📭 Пока ничего нет. Добавьте криптовалюты в избранное!
        </div>
      ) : (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {favorites.map(fav => (
            <li
              key={fav.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                background: '#1a1a1a',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0, 255, 255, 0.2)',
                transition: 'transform 0.2s',
              }}
            >
              {/* Инфо о монете */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {fav.image_url && (
                  <img
                    src={fav.image_url}
                    alt={fav.name}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '6px',
                      border: '2px solid #0ff'
                    }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    {fav.name} <span style={{ color: '#888' }}>({fav.symbol})</span>
                  </div>
                  <div style={{ color: '#0f0', fontSize: '15px', marginTop: '4px' }}>
                    ${fav.price?.toLocaleString() || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Кнопки */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleDelete(fav.id)}
                  style={{
                    padding: '8px 14px',
                    background: 'linear-gradient(45deg, #ff0000, #800000)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'transform 0.2s, background 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.background = 'linear-gradient(45deg, #800000, #ff0000)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'linear-gradient(45deg, #ff0000, #800000)';
                  }}
                >
                  ❌ Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
