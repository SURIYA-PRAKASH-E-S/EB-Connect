from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.permissions import IsAdminRole

from .models import Customer
from .serializers import (
    CustomerSerializer,
    RegisterSerializer,
    LoginSerializer
)
from rest_framework.permissions import IsAuthenticated
from connections.models import (
    ConnectionApplication,
    Connection,
    Meter
)
from bills.models import Bill, Payment

class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.customer_profile.role == "Admin":
            return Customer.objects.all().order_by("-id")

        return Customer.objects.filter(
            user=user
        ).order_by("-id")

    def update(self, request, *args, **kwargs):
        if request.user.customer_profile.role != "Admin":
            allowed_fields = {
                "name",
                "email",
                "phone",
                "address",
                "city",
                "state",
                "pincode",
            }

            data = {
                key: value
                for key, value in request.data.items()
                if key in allowed_fields
            }

            serializer = self.get_serializer(
                self.get_object(),
                data=data,
                partial=True
            )

            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data)

        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )

        if serializer.is_valid():
            customer = serializer.save()

            return Response(
                {
                    "message": "Registration successful.",
                    "customer": {
                        "id": customer.id,
                        "name": customer.name,
                        "email": customer.email,
                        "role": customer.role
                    }
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):

    def post(self, request):

        serializer = LoginSerializer(
            data=request.data
        )

        if serializer.is_valid():

            return Response(
                serializer.validated_data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_401_UNAUTHORIZED
        )

class DashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user
        customer = user.customer_profile

        # =========================
        # ADMIN DASHBOARD
        # =========================

        if customer.role == "Admin":

            total_customers = Customer.objects.count()

            total_applications = (
                ConnectionApplication.objects.count()
            )

            pending_applications = (
                ConnectionApplication.objects.filter(
                    status="Pending"
                ).count()
            )

            approved_applications = (
                ConnectionApplication.objects.filter(
                    status="Approved"
                ).count()
            )

            total_connections = Connection.objects.count()

            total_meters = Meter.objects.count()

            total_bills = Bill.objects.count()

            paid_bills = Bill.objects.filter(
                status="Paid"
            ).count()

            unpaid_bills = Bill.objects.filter(
                status="Unpaid"
            ).count()

            total_payments = Payment.objects.count()

            return Response({
                "role": "Admin",
                "customers": total_customers,
                "applications": total_applications,
                "pending_applications": pending_applications,
                "approved_applications": approved_applications,
                "connections": total_connections,
                "meters": total_meters,
                "bills": total_bills,
                "paid_bills": paid_bills,
                "unpaid_bills": unpaid_bills,
                "payments": total_payments
            })


        # =========================
        # CUSTOMER DASHBOARD
        # =========================

        customer_applications = ConnectionApplication.objects.filter(
            customer=customer
        )

        customer_connections = Connection.objects.filter(
            customer=customer
        )

        customer_meters = Meter.objects.filter(
            connection__customer=customer
        )

        customer_bills = Bill.objects.filter(
            connection__customer=customer
        )

        customer_payments = Payment.objects.filter(
            bill__connection__customer=customer
        )

        unpaid_bills = customer_bills.filter(
            status="Unpaid"
        ).count()

        paid_amount = sum(
            payment.amount
            for payment in customer_payments
        )

        return Response({
            "role": "Customer",
            "applications": customer_applications.count(),
            "connections": customer_connections.count(),
            "meters": customer_meters.count(),
            "bills": customer_bills.count(),
            "unpaid_bills": unpaid_bills,
            "total_paid": paid_amount
        })