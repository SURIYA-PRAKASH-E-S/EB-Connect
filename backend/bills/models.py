from django.db import models
from connections.models import Connection


class Bill(models.Model):

    STATUS_CHOICES = [
        ("Unpaid", "Unpaid"),
        ("Paid", "Paid"),
        ("Overdue", "Overdue"),
    ]

    connection = models.ForeignKey(
        Connection,
        on_delete=models.CASCADE
    )

    bill_number = models.CharField(
        max_length=30,
        unique=True
    )

    billing_month = models.CharField(
        max_length=20
    )

    previous_reading = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    current_reading = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    units_consumed = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    due_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Unpaid"
    )

    def __str__(self):
        return self.bill_number


class Payment(models.Model):

    PAYMENT_METHODS = [
        ("UPI", "UPI"),
        ("Card", "Card"),
        ("Net Banking", "Net Banking"),
        ("Cash", "Cash"),
    ]

    bill = models.ForeignKey(
        Bill,
        on_delete=models.CASCADE
    )

    payment_reference = models.CharField(
        max_length=100,
        unique=True
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    payment_date = models.DateTimeField(
        auto_now_add=True
    )

    payment_method = models.CharField(
        max_length=30,
        choices=PAYMENT_METHODS
    )

    status = models.CharField(
        max_length=20,
        default="Success"
    )

    def __str__(self):
        return self.payment_reference