from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """
    Allows access only to users whose Customer profile role is Admin.
    """

    def has_permission(self, request, view):

        if not request.user or not request.user.is_authenticated:
            return False

        try:
            return request.user.customer_profile.role == "Admin"
        except Exception:
            return False