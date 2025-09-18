from rest_framework import serializers
from .models import Favorite
from cryptos.models import Crypto

class CryptoNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crypto
        fields = ("id", "name", "symbol", "image_url", "current_price")  # добавляем нужные поля

class FavoriteSerializer(serializers.ModelSerializer):
    crypto = CryptoNestedSerializer(read_only=True)  # вложенный объект

    class Meta:
        model = Favorite
        fields = ("id", "crypto")