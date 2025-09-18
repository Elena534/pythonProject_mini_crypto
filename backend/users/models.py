from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class FavoriteCrypto(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    coin_id = models.CharField(max_length=200)
    name = models.CharField(max_length=200, blank=True)
    symbol = models.CharField(max_length=50, blank=True)
    image_url = models.URLField(blank=True, null=True)   # картинка
    added_at = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=20, decimal_places=8, blank=True, null=True)

    class Meta:
        unique_together = ("user", "coin_id")
        ordering = ["-added_at"]

    def __str__(self):
        return f"{self.user.username} — {self.coin_id} ({self.symbol})"
