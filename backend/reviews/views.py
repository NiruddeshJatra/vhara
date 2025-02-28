from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page


@method_decorator(cache_page(60 * 15), name='list')
class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)

    def create(self, request, *args, **kwargs):
        rental_id = request.data.get("rental")
        review_type = request.data.get("review_type")
        
        if Review.objects.filter(
            reviewer=request.user,
            rental_id=rental_id,
            review_type=review_type
        ).exists():
            return Response(
                {"error": "You have already reviewed this rental"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)