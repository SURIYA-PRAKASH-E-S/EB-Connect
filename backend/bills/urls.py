from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    BillViewSet,
    PaymentViewSet
)


router = DefaultRouter()

router.register(
    "bills",
    BillViewSet,
    basename="bill"
)

router.register(
    "payments",
    PaymentViewSet,
    basename="payment"
)


urlpatterns = [
    path("", include(router.urls)),
]