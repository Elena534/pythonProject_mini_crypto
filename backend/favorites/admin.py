from django.contrib import admin
from .models import Favorite

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user_username', 'crypto_name')
    search_fields = ('user__username', 'crypto__name')  # Поиск можно делать через __

    def user_username(self, obj):
        return obj.user.username
    user_username.short_description = 'Username'

    def crypto_name(self, obj):
        return obj.crypto.name
    crypto_name.short_description = 'Crypto'