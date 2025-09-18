
from django.contrib import admin
from .models import Crypto

@admin.register(Crypto)
class CryptoAdmin(admin.ModelAdmin):
    list_display = ('name', 'symbol', 'price_usd')
    search_fields = ('name', 'symbol')