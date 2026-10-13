from datetime import date

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdminRole

from .models import (
    ConnectionApplication,
    Connection,
    Meter
)

from .serializers import (
    ConnectionApplicationSerializer,
    ConnectionSerializer,
    MeterSerializer
)


class ConnectionApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ConnectionApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.customer_profile.role == "Admin":
            return ConnectionApplication.objects.all().order_by("-id")

        return ConnectionApplication.objects.filter(
            customer=user.customer_profile
        ).order_by("-id")

    def perform_create(self, serializer):
        serializer.save(
            customer=self.request.user.customer_profile
        )

    @action(
        detail=True,
        methods=["patch"],
        url_path="review",
        permission_classes=[IsAdminRole]
    )
    def review(self, request, pk=None):
        application = self.get_object()

        new_status = request.data.get("status")

        allowed_statuses = [
            "Pending",
            "Under Review",
            "Approved",
            "Rejected"
        ]

        if new_status not in allowed_statuses:
            return Response(
                {"error": "Invalid status."},
                status=status.HTTP_400_BAD_REQUEST
            )

        application.status = new_status
        application.save()

        serializer = self.get_serializer(application)

        return Response(serializer.data)

    @action(
        detail=True,
        methods=["post"],
        url_path="create-connection",
        permission_classes=[IsAdminRole]
    )
    def create_connection(self, request, pk=None):

        application = self.get_object()

        if application.status != "Approved":
            return Response(
                {
                    "error": "Only approved applications can create a connection."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        existing_connection = Connection.objects.filter(
            customer=application.customer,
            connection_type=application.connection_type
        ).first()

        if existing_connection:
            return Response(
                {
                    "error": "A connection already exists for this customer."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate connection number
        last_connection = Connection.objects.order_by("-id").first()

        if last_connection:
            connection_number = f"EB-{1000 + last_connection.id + 1}"
        else:
            connection_number = "EB-1001"

        # Generate meter number
        last_meter = Meter.objects.order_by("-id").first()

        if last_meter:
            meter_number = f"MTR-{1000 + last_meter.id + 1}"
        else:
            meter_number = "MTR-1001"

        # Create connection
        connection = Connection.objects.create(
            customer=application.customer,
            connection_number=connection_number,
            connection_type=application.connection_type,
            meter_number=meter_number,
            load=application.requested_load,
            connection_date=date.today(),
            status="Active"
        )

        # Create meter automatically
        Meter.objects.create(
            connection=connection,
            meter_number=meter_number,
            meter_type="Digital",
            initial_reading=0,
            current_reading=0,
            installation_date=date.today(),
            status="Active"
        )

        serializer = ConnectionSerializer(connection)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
def update(self, request, *args, **kwargs):
    if request.user.customer_profile.role != "Admin":
        return Response(
            {"error": "Only Admin can update applications."},
            status=status.HTTP_403_FORBIDDEN
        )

    return super().update(request, *args, **kwargs)


def partial_update(self, request, *args, **kwargs):
    if request.user.customer_profile.role != "Admin":
        return Response(
            {"error": "Only Admin can update applications."},
            status=status.HTTP_403_FORBIDDEN
        )

    return super().partial_update(request, *args, **kwargs)


def destroy(self, request, *args, **kwargs):
    if request.user.customer_profile.role != "Admin":
        return Response(
            {"error": "Only Admin can delete applications."},
            status=status.HTTP_403_FORBIDDEN
        )

    return super().destroy(request, *args, **kwargs)

class ConnectionViewSet(viewsets.ModelViewSet):

    serializer_class = ConnectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        if user.customer_profile.role == "Admin":
            return Connection.objects.all().order_by("-id")

        return Connection.objects.filter(
            customer=user.customer_profile
        ).order_by("-id")
def create(self, request, *args, **kwargs):
    if request.user.customer_profile.role != "Admin":
        return Response(
            {"error": "Only Admin can create connections."},
            status=status.HTTP_403_FORBIDDEN
        )

    return super().create(request, *args, **kwargs)


def update(self, request, *args, **kwargs):
    if request.user.customer_profile.role != "Admin":
        return Response(
            {"error": "Only Admin can update connections."},
            status=status.HTTP_403_FORBIDDEN
        )

    return super().update(request, *args, **kwargs)


def partial_update(self, request, *args, **kwargs):
    if request.user.customer_profile.role != "Admin":
        return Response(
            {"error": "Only Admin can update connections."},
            status=status.HTTP_403_FORBIDDEN
        )

    return super().partial_update(request, *args, **kwargs)


def destroy(self, request, *args, **kwargs):
    if request.user.customer_profile.role != "Admin":
        return Response(
            {"error": "Only Admin can delete connections."},
            status=status.HTTP_403_FORBIDDEN
        )

    return super().destroy(request, *args, **kwargs)


class MeterViewSet(viewsets.ModelViewSet):

    serializer_class = MeterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        if user.customer_profile.role == "Admin":
            return Meter.objects.all().order_by("-id")

        return Meter.objects.filter(
            connection__customer=user.customer_profile
        ).order_by("-id")

def create(self, request, *args, **kwargs):
    if request.user.customer_profile.role != "Admin":
        return Response(
            {"error": "Only Admin can create meters."},
            status=status.HTTP_403_FORBIDDEN
        )

    return super().create(request, *args, **kwargs)


def update(self, request, *args, **kwargs):
    if request.user.customer_profile.role != "Admin":
        return Response(
            {"error": "Only Admin can update meters."},
            status=status.HTTP_403_FORBIDDEN
        )

    return super().update(request, *args, **kwargs)


def partial_update(self, request, *args, **kwargs):
    if request.user.customer_profile.role != "Admin":
        return Response(
            {"error": "Only Admin can update meters."},
            status=status.HTTP_403_FORBIDDEN
        )

    return super().partial_update(request, *args, **kwargs)


def destroy(self, request, *args, **kwargs):
    if request.user.customer_profile.role != "Admin":
        return Response(
            {"error": "Only Admin can delete meters."},
            status=status.HTTP_403_FORBIDDEN
        )

    return super().destroy(request, *args, **kwargs)