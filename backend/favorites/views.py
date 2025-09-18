from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound
from django.shortcuts import get_object_or_404
from .models import Favorite
from .serializers import FavoriteSerializer
from cryptos.models import Crypto


class FavoriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('crypto')

    def perform_create(self, serializer):
        crypto_id = self.request.data.get("crypto")

        if not crypto_id:
            raise ValidationError({"crypto": "This field is required"})

        try:
            crypto = Crypto.objects.get(id=crypto_id)
        except Crypto.DoesNotExist:
            raise NotFound({"error": "Cryptocurrency not found"})

        # Проверяем, не добавлено ли уже в избранное
        if Favorite.objects.filter(user=self.request.user, crypto=crypto).exists():
            raise ValidationError({"error": "This cryptocurrency is already in favorites"})

        serializer.save(user=self.request.user, crypto=crypto)

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            response.data['message'] = 'Cryptocurrency added to favorites successfully'
            return response
        except (ValidationError, NotFound) as e:
            return Response(e.detail, status=e.status_code)


class FavoriteDeleteView(generics.DestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def get_object(self):
        # Получаем crypto_id из URL
        crypto_id = self.kwargs.get('crypto_id')

        if not crypto_id:
            raise ValidationError({"crypto_id": "This parameter is required"})

        # Находим криптовалюту
        crypto = get_object_or_404(Crypto, id=crypto_id)

        # Находим избранное для этого пользователя и криптовалюты
        favorite = get_object_or_404(
            Favorite,
            user=self.request.user,
            crypto=crypto
        )

        return favorite

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(
                {"message": "Cryptocurrency removed from favorites successfully"},
                status=status.HTTP_200_OK
            )
        except (ValidationError, NotFound) as e:
            return Response(e.detail, status=e.status_code)
