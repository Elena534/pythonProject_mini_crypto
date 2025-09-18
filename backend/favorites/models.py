from django.db import models
from django.conf import settings
from cryptos.models import Crypto  # Импортируем модель криптовалют

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    crypto = models.ForeignKey(Crypto, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'crypto')  # Один пользователь не может добавить одинаковую монету дважды

    def __str__(self):
        return f"{self.user} — {self.crypto.name}"

