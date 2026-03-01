from django.urls import path

from .views import dashboard_stats, health_check, public_config

urlpatterns = [
    path("health/", health_check, name="core_health"),
    path("config/", public_config, name="core_config"),
    path("stats/", dashboard_stats, name="core_stats"),
]
