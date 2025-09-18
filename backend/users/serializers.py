from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FavoriteCrypto
import requests

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=6)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password")

    def create(self, validated_data):
        user = User(username=validated_data["username"], email=validated_data.get("email", ""))
        user.set_password(validated_data["password"])
        user.save()
        return user

class FavoriteCryptoSerializer(serializers.ModelSerializer):
    current_price = serializers.SerializerMethodField()
    class Meta:
        model = FavoriteCrypto
        fields = ("id", "coin_id", "name","image_url", "symbol", "added_at","current_price")
        read_only_fields = ("id", "added_at","current_price","image_url")

    def get_current_price(self, obj):
        """
        Берем цену с CoinGecko API в реальном времени
        """
        try:
            url = f"https://api.coingecko.com/api/v3/simple/price?ids={obj.coin_id}&vs_currencies=usd"
            res = requests.get(url).json()
            return res.get(obj.coin_id, {}).get("usd")
        except Exception:
            return None

