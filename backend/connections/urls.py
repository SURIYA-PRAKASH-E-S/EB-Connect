from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ConnectionApplicationViewSet,
    ConnectionViewSet,
    MeterViewSet
)


router = DefaultRouter()

router.register(
    "applications",
    ConnectionApplicationViewSet,
    basename="application"
)

router.register(
    "connections",
    ConnectionViewSet,
    basename="connection"
)

router.register(
    "meters",
    MeterViewSet,
    basename="meter"
)


urlpatterns = [
    path("", include(router.urls)),
]