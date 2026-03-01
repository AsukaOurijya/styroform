from django.db import models
from django.db.models import Q


class AppContent(models.Model):
    site_name = models.CharField(max_length=120, default="Styroform")
    hero_title = models.CharField(max_length=200, default="Build, Share, Collect Effortlessly.")
    hero_subtitle = models.CharField(
        max_length=300,
        default="Build fast forms and collect responses with Styroform.",
    )
    hero_cta_text = models.CharField(max_length=60, default="Explore Forms")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["is_active"],
                condition=Q(is_active=True),
                name="single_active_app_content",
            )
        ]

    def __str__(self):
        status = "active" if self.is_active else "inactive"
        return f"{self.site_name} ({status})"
