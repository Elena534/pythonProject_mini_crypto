from django.shortcuts import render

import requests
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, FavoriteCryptoSerializer
from .models import FavoriteCrypto

COINGECKO_BASE = "https://api.coingecko.com/api/v3"

class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class CryptoListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        params = {
            "vs_currency": request.query_params.get("vs_currency", "usd"),
            "order": "market_cap_desc",
            "per_page": request.query_params.get("per_page", 50),
            "page": request.query_params.get("page", 1),
            "sparkline": "false",
        }
        try:
            resp = requests.get(f"{COINGECKO_BASE}/coins/markets", params=params, timeout=10)
            resp.raise_for_status()
        except requests.RequestException as e:
            return Response({"detail": "CoinGecko is unavailable", "error": str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response(resp.json())

class FavoritesListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteCryptoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FavoriteCrypto.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FavoriteDeleteView(generics.DestroyAPIView):
    serializer_class = FavoriteCryptoSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        return FavoriteCrypto.objects.filter(user=self.request.user)

