from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CustomerViewSet,
    RegisterView,
    LoginView,
    DashboardView
)


router = DefaultRouter()

router.register(
    "customers",
    CustomerViewSet,
    basename="customer"
)


urlpatterns = [

    path(
        "",
        include(router.urls)
    ),

    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    path(
        "login/",
        LoginView.as_view(),
        name="login"
    ),
    path(
    "dashboard/",
    DashboardView.as_view(),
    name="dashboard"
),
]