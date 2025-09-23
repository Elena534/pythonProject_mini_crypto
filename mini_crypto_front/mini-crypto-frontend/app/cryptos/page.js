'use client';
import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import AddFavoriteButton from '../favorites/AddFavoriteButton';
import { AuthContext } from '@/context/AuthContext';

export default function CryptosPage() {
  const [cryptos, setCryptos] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { auth } = useContext(AuthContext);

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      const cryptosResponse = await api.get('/api/cryptos/');
      setCryptos(cryptosResponse.data);
      setError('');

      // Сохраняем в кэш
      localStorage.setItem('cryptosCache', JSON.stringify(cryptosResponse.data));
      localStorage.setItem('cryptosCacheTime', Date.now());

    } catch (err) {
      console.log('Ошибка загрузки криптовалют, пробуем кэш...', err);

      // Пробуем получить данные из кэша
      const cachedCryptos = localStorage.getItem('cryptosCache');
      const cacheTime = localStorage.getItem('cryptosCacheTime');

      if (cachedCryptos && cacheTime && Date.now() - cacheTime < 300000) {
        setCryptos(JSON.parse(cachedCryptos));
        setError('Данные из кэша (CoinGecko временно недоступен)');
      } else {
        setError('Не удалось загрузить данные о криптовалютах');
      }
    }
  };

  const fetchFavorites = async () => {
    if (!auth?.access) {
      setFavorites([]);
      return;
    }

    try {
      const favoritesResponse = await api.get('/api/favorites/');
      setFavorites(favoritesResponse.data);
    } catch (favError) {
      console.error('Ошибка загрузки избранного:', favError);
      if (favError.response?.status === 401) {
        setFavorites([]);
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // Сначала проверяем кэш для криптовалют
      const cachedCryptos = localStorage.getItem('cryptosCache');
      const cacheTime = localStorage.getItem('cryptosCacheTime');

      if (cachedCryptos && cacheTime && Date.now() - cacheTime < 300000) {
        setCryptos(JSON.parse(cachedCryptos));
        setError('Данные из кэша');
      } else {
        await fetchCryptos();
      }

      await fetchFavorites();
      setLoading(false);
    };

    loadData();
  }, [auth?.access]);

  const retryLoad = () => {
    setLoading(true);
    fetchCryptos();
    fetchFavorites().finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#111',
        color: '#0ff'
      }}>
        Загрузка данных...
      </div>
    );
  }

  if (error && cryptos.length === 0) {
    return (
      <div style={{
        padding: '20px',
        background: '#111',
        minHeight: '100vh',
        color: '#0ff',
        textAlign: 'center'
      }}>
        <h2>Ошибка загрузки</h2>
        <p style={{ color: '#ff6b6b', margin: '20px 0' }}>{error}</p>
        <button
          onClick={retryLoad}
          style={{
            padding: '10px 20px',
            background: '#0ff',
            color: '#111',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Попробовать снова
        </button>
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
      <h2 style={{ marginBottom: '20px' }}>Криптовалюты</h2>

      {error && (
        <div style={{
          background: '#333',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #0ff'
        }}>
          ⚠️ {error}
        </div>
      )}

      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0
      }}>
        {cryptos.map((coin) => {
          const favItem = favorites.find(f => f.crypto?.id === coin.id || f.crypto?.coin_id === coin.id);
          return (
            <li
              key={coin.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                padding: '15px',
                background: '#222',
                borderRadius: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {coin.image && (
                  <img
                    src={coin.image}
                    alt={coin.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '4px'
                    }}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjIwIiB5PSIyMCIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSIxMiI+Q1k8L3RleHQ+Cjwvc3ZnPg==';
                    }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {coin.name} ({coin.symbol?.toUpperCase()})
                  </div>
                  <div style={{ color: '#0f0' }}>
                    ${coin.current_price?.toLocaleString() || 'N/A'}
                  </div>
                </div>
              </div>

              <AddFavoriteButton
                coin={coin}
                initialFav={!!favItem}
                favoriteId={favItem?.id}
              />
            </li>
          );
        })}
      </ul>

      {cryptos.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#888'
        }}>
          Нет данных о крипте
        </div>
      )}
    </div>
  );
}