from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profile_pictures/", null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    social_links = models.JSONField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        editable=False
    )

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return self.username

    def update_average_rating(self):
        from reviews.models import Review
        reviews = Review.objects.filter(
            review_type='user',
            rental__in=self.rentals_as_owner.all() | self.rentals_as_renter.all()
        ).exclude(reviewer=self)
        avg_rating = reviews.aggregate(models.Avg('rating'))['rating__avg'] or 0.0
        self.average_rating = round(avg_rating, 2)
        self.save()