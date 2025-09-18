from django.contrib import admin
from .models import FavoriteCrypto

@admin.register(FavoriteCrypto)
class FavoriteCryptoAdmin(admin.ModelAdmin):
    list_display = ("user", "coin_id", "name", "symbol", "added_at")  # столбцы, которые будут отображаться в списке
    search_fields = ("user__username", "coin_id", "name", "symbol")  # возможность поиска
    list_filter = ("added_at",)  # фильтры справа
    ordering = ("-added_at",)  # сортировка по умолчанию
