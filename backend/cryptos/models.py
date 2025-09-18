from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

class Crypto(models.Model):
    name = models.CharField(max_length=100)  # Bitcoin, Ethereum
    symbol = models.CharField(max_length=10, unique=True)  # BTC, ETH
    price_usd = models.DecimalField(
        max_digits=20,
        decimal_places=8,
        null=True,
        blank=True,
        verbose_name="Price in USD"
    )
    coin_id = models.CharField(
        max_length=100,
        unique=True,
        null=True,
        blank=True,
        verbose_name="CoinGecko ID",
        help_text="ID from CoinGecko API (e.g., 'bitcoin')"
    )
    image_url = models.URLField(
        blank=True,
        null=True,
        verbose_name="Image URL"
    )
    market_cap_rank = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name="Market Cap Rank"
    )
    last_updated = models.DateTimeField(
        auto_now=True,
        verbose_name="Last Updated"
    )

    class Meta:
        ordering = ['market_cap_rank', 'name']
        verbose_name = "Cryptocurrency"
        verbose_name_plural = "Cryptocurrencies"

    def __str__(self):
        return f"{self.name} ({self.symbol})"

    def clean(self):
        """Валидация данных"""
        if self.price_usd and self.price_usd < 0:
            raise ValidationError("Price cannot be negative")
        if self.symbol:
            self.symbol = self.symbol.upper()

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class Favorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="crypto_favorites"
    )
    crypto = models.ForeignKey(
        Crypto,
        on_delete=models.CASCADE,
        related_name="favorited_by"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Added at"
    )
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="User notes",
        help_text="Personal notes about this cryptocurrency"
    )

    class Meta:
        unique_together = ('user', 'crypto')
        ordering = ['-created_at']
        verbose_name = "Favorite cryptocurrency"
        verbose_name_plural = "Favorite cryptocurrencies"

    def __str__(self):
        return f"{self.user.username} → {self.crypto.symbol}"

    def clean(self):
        """Проверка, что пользователь не добавляет одно и то же дважды"""
        if Favorite.objects.filter(user=self.user, crypto=self.crypto).exclude(pk=self.pk).exists():
            raise ValidationError("This cryptocurrency is already in favorites")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)