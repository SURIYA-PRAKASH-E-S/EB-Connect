from django.db import models
from accounts.models import Customer


class ConnectionApplication(models.Model):

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Under Review", "Under Review"),
        ("Approved", "Approved"),
        ("Rejected", "Rejected"),
    ]

    CONNECTION_TYPES = [
        ("Domestic", "Domestic"),
        ("Commercial", "Commercial"),
    ]

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE
    )

    application_number = models.CharField(
        max_length=30,
        unique=True
    )

    connection_type = models.CharField(
        max_length=20,
        choices=CONNECTION_TYPES
    )

    requested_load = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    address = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    applied_date = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.application_number


class Connection(models.Model):

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
        ("Disconnected", "Disconnected"),
    ]

    CONNECTION_TYPES = [
        ("Domestic", "Domestic"),
        ("Commercial", "Commercial"),
    ]

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE
    )

    connection_number = models.CharField(
        max_length=30,
        unique=True
    )

    connection_type = models.CharField(
        max_length=20,
        choices=CONNECTION_TYPES
    )

    meter_number = models.CharField(
        max_length=30,
        unique=True
    )

    load = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    connection_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Active"
    )

    def __str__(self):
        return self.connection_number



class Meter(models.Model):

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
        ("Faulty", "Faulty"),
    ]

    connection = models.OneToOneField(
        Connection,
        on_delete=models.CASCADE
    )

    meter_number = models.CharField(
        max_length=30,
        unique=True
    )

    meter_type = models.CharField(
        max_length=50
    )

    initial_reading = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    current_reading = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    installation_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Active"
    )

    def __str__(self):
        return self.meter_number