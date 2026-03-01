from django.contrib import admin

from .models import AppContent


@admin.register(AppContent)
class AppContentAdmin(admin.ModelAdmin):
    list_display = ("site_name", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("site_name", "hero_title")
