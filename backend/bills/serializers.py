from rest_framework import serializers
from .models import Bill, Payment


class BillSerializer(serializers.ModelSerializer):
    connection_number = serializers.CharField(
        source="connection.connection_number",
        read_only=True
    )

    customer_name = serializers.CharField(
        source="connection.customer.name",
        read_only=True
    )

    class Meta:
        model = Bill
        fields = [
            "id",
            "connection",
            "connection_number",
            "customer_name",
            "bill_number",
            "billing_month",
            "previous_reading",
            "current_reading",
            "units_consumed",
            "amount",
            "due_date",
            "status",
        ]

        read_only_fields = [
            "units_consumed",
            "amount",
        ]

    def validate(self, data):
        previous = data.get(
            "previous_reading",
            getattr(self.instance, "previous_reading", 0)
        )

        current = data.get(
            "current_reading",
            getattr(self.instance, "current_reading", 0)
        )

        if current < previous:
            raise serializers.ValidationError(
                "Current reading cannot be less than previous reading."
            )

        units = current - previous

        data["units_consumed"] = units

        # Simple electricity tariff
        if units <= 100:
            amount = units * 3
        elif units <= 200:
            amount = (100 * 3) + ((units - 100) * 4)
        elif units <= 500:
            amount = (100 * 3) + (100 * 4) + ((units - 200) * 5)
        else:
            amount = (100 * 3) + (100 * 4) + (300 * 5) + ((units - 500) * 6)

        data["amount"] = amount

        return data


class PaymentSerializer(serializers.ModelSerializer):
    bill_number = serializers.CharField(
        source="bill.bill_number",
        read_only=True
    )

    customer_name = serializers.CharField(
        source="bill.connection.customer.name",
        read_only=True
    )

    bill_amount = serializers.DecimalField(
        source="bill.amount",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = Payment
        fields = [
            "id",
            "bill",
            "bill_number",
            "customer_name",
            "bill_amount",
            "payment_reference",
            "amount",
            "payment_date",
            "payment_method",
            "status",
        ]