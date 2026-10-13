from rest_framework import serializers

from .models import ConnectionApplication, Connection, Meter


class ConnectionApplicationSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="customer.name",
        read_only=True
    )

    customer_email = serializers.CharField(
        source="customer.email",
        read_only=True
    )

    customer = serializers.PrimaryKeyRelatedField(
    read_only=True)
    

    class Meta:
        model = ConnectionApplication
        fields = [
            "id",
            "customer",
            "customer_name",
            "customer_email",
            "application_number",
            "connection_type",
            "requested_load",
            "address",
            "status",
            "applied_date",
        ]


class ConnectionSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="customer.name",
        read_only=True
    )

    class Meta:
        model = Connection
        fields = [
            "id",
            "customer",
            "customer_name",
            "connection_number",
            "connection_type",
            "meter_number",
            "load",
            "connection_date",
            "status",
        ]


class MeterSerializer(serializers.ModelSerializer):
    connection_number = serializers.CharField(
        source="connection.connection_number",
        read_only=True
    )

    customer_name = serializers.CharField(
        source="connection.customer.name",
        read_only=True
    )

    class Meta:
        model = Meter
        fields = [
            "id",
            "connection",
            "connection_number",
            "customer_name",
            "meter_number",
            "meter_type",
            "initial_reading",
            "current_reading",
            "installation_date",
            "status",
        ]