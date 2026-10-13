from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdminRole
from .models import Bill, Payment
from .serializers import BillSerializer, PaymentSerializer


class BillViewSet(viewsets.ModelViewSet):
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.customer_profile.role == "Admin":
            return Bill.objects.all().order_by("-id")

        return Bill.objects.filter(
            connection__customer=user.customer_profile
        ).order_by("-id")

    def create(self, request, *args, **kwargs):
        if request.user.customer_profile.role != "Admin":
            return Response(
                {"error": "Only Admin can create bills."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.user.customer_profile.role != "Admin":
            return Response(
                {"error": "Only Admin can update bills."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if request.user.customer_profile.role != "Admin":
            return Response(
                {"error": "Only Admin can update bills."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.customer_profile.role != "Admin":
            return Response(
                {"error": "Only Admin can delete bills."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().destroy(request, *args, **kwargs)


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.customer_profile.role == "Admin":
            return Payment.objects.all().order_by("-id")

        return Payment.objects.filter(
            bill__connection__customer=user.customer_profile
        ).order_by("-id")

    def create(self, request, *args, **kwargs):
        bill_id = request.data.get("bill")
        amount = request.data.get("amount")
        payment_method = request.data.get("payment_method")
        payment_reference = request.data.get("payment_reference")

        if not bill_id:
            return Response(
                {"error": "Bill is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            bill = Bill.objects.get(id=bill_id)
        except Bill.DoesNotExist:
            return Response(
                {"error": "Bill not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Customer can only pay their own bill
        if (
            bill.connection.customer != request.user.customer_profile
            and request.user.customer_profile.role != "Admin"
        ):
            return Response(
                {"error": "You cannot pay this bill."},
                status=status.HTTP_403_FORBIDDEN
            )

        if bill.status == "Paid":
            return Response(
                {"error": "This bill has already been paid."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not amount:
            return Response(
                {"error": "Payment amount is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if float(amount) != float(bill.amount):
            return Response(
                {"error": "Payment amount must match the bill amount."},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment = Payment.objects.create(
            bill=bill,
            payment_reference=payment_reference,
            amount=amount,
            payment_method=payment_method,
            status="Success"
        )

        bill.status = "Paid"
        bill.save()

        serializer = self.get_serializer(payment)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )