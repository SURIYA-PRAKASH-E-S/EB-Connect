from django.db import models
from django.contrib.auth.models import User


class Customer(models.Model):

    ROLE_CHOICES = [
        ("Customer", "Customer"),
        ("Admin", "Admin"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="customer_profile"
    )

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="Customer"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name