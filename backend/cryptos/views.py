from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.cache import cache
import requests
from .models import Crypto, Favorite
from .serializers import CryptoSerializer, FavoriteSerializer


class CryptoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CryptoSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Возвращаем кэшированные данные или из БД
        return Crypto.objects.all()[:50]  # лимит для безопасности

    def list(self, request):
        COINGECKO_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false"

        # Пытаемся получить свежие данные от CoinGecko
        try:
            response = requests.get(COINGECKO_URL, timeout=10)
            if response.status_code == 200:
                fresh_data = response.json()

                # Сохраняем свежие данные в кэш
                cache.set('cryptos_fresh_data', fresh_data, timeout=300)

                # Обновляем или создаем записи в БД
                for coin_data in fresh_data:
                    crypto, created = Crypto.objects.update_or_create(
                        coin_id=coin_data['id'],
                        defaults={
                            'name': coin_data['name'],
                            'symbol': coin_data['symbol'],
                            'current_price': coin_data['current_price'],
                            'image_url': coin_data.get('image', ''),
                            'market_cap': coin_data.get('market_cap'),
                            'price_change_24h': coin_data.get('price_change_24h'),
                        }
                    )

                # Возвращаем свежие данные
                return Response(fresh_data)

        except (requests.RequestException, requests.Timeout, requests.ConnectionError):
            # Если CoinGecko недоступен - используем кэш или БД
            pass

        # Пробуем взять данные из кэша
        cached_data = cache.get('cryptos_fresh_data')
        if cached_data:
            return Response(cached_data)

        # Если кэш пустой - возвращаем данные из БД
        cryptos = Crypto.objects.all().order_by('-market_cap')[:50]
        serializer = self.get_serializer(cryptos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def top(self, request):
        """Топ-10 криптовалют"""
        cryptos = Crypto.objects.all().order_by('-market_cap')[:10]
        serializer = self.get_serializer(cryptos, many=True)
        return Response(serializer.data)