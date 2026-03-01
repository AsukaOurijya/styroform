from django.urls import path

from .views import (
    account_redirect,
    current_user,
    explore_redirect,
    login_user,
    logout_user,
    register_user,
    session_status,
    update_current_user,
)

urlpatterns = [
    path("register/", register_user, name="register_user"),
    path("login/", login_user, name="login_user"),
    path("logout/", logout_user, name="logout_user"),
    path("session/", session_status, name="session_status"),
    path("me/", current_user, name="current_user"),
    path("me/update/", update_current_user, name="update_current_user"),
    path("explore/", explore_redirect, name="explore_redirect"),
    path("account/", account_redirect, name="account_redirect"),
]
