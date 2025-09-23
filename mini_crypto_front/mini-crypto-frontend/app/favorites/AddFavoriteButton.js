'use client';
import api, { authHeaders } from '../api/axios';
import { useState, useEffect } from 'react';

export default function AddFavoriteButton({ coin, initialFav = false }) {
  const [isFav, setIsFav] = useState(initialFav);
  const [loading, setLoading] = useState(false);

  // Проверяем при монтировании, есть ли монета в избранном
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const response = await api.get('/api/favorites/', {
          headers: authHeaders()
        });
        const isFavorite = response.data.some(item => item.coin_id === coin.id);
        setIsFav(isFavorite);
      } catch (err) {
        console.error('Ошибка проверки избранного:', err);
      }
    };
    checkFavorite();
  }, [coin.id]);

  const handleAdd = async () => {
    if (loading || isFav) return;
    setLoading(true);

    try {
      const response = await api.post(
        '/api/favorites/',
        { coin_id: coin.id, name: coin.name, symbol: coin.symbol },
        { headers: authHeaders() }
      );

      // Обрабатываем разные статусы ответа
      if (response.status === 201) {
        setIsFav(true);
        alert(`${coin.name} добавлен в избранное!`);
      } else if (response.status === 400 && response.data.detail?.includes('уже в избранном')) {
        setIsFav(true);
        alert('Эта монета уже в вашем избранном');
      }
    } catch (err) {
      if (err.response?.status === 400) {
        // Если бэкенд вернул информацию о дубликате
        setIsFav(true);
        alert('Эта монета уже в вашем избранном');
      } else {
        console.error(err);
        alert('Ошибка добавления в избранное');
      }
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = {
    padding: '6px 12px',
    border: `2px solid ${isFav ? '#ff5555' : '#ff0000'}`,
    background: isFav ? '#ff5555' : 'transparent',
    color: isFav ? '#fff' : '#ff0000',
    borderRadius: '4px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    cursor: isFav || loading ? 'default' : 'pointer',
    transition: 'all 0.2s',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    opacity: loading ? 0.7 : 1,
  };

  const heartStyle = {
    color: isFav ? '#fff' : '#ff0000',
    transform: isFav ? 'scale(1.3)' : 'scale(1)',
    transition: 'transform 0.2s',
  };

  return (
    <button
      style={buttonStyle}
      onClick={handleAdd}
      disabled={loading || isFav}
      title={isFav ? 'Уже в избранном' : 'Добавить в избранное'}
    >
      <span style={heartStyle}>{isFav ? '💥' : '💢'}</span>
      {loading ? '...' : isFav ? 'Added' : 'Favorite'}
    </button>
  );
}