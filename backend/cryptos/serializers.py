from rest_framework import serializers
from .models import Crypto, Favorite

class CryptoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crypto
        fields = '__all__'


class FavoriteSerializer(serializers.ModelSerializer):
    crypto = CryptoSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'crypto']
