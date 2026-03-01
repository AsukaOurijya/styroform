from django.http import JsonResponse
from django.utils import timezone

from accounts.models import User
from forms.models import Form

from .models import AppContent


def _authenticated_user(request):
    user_id = request.session.get("user_id")
    if not user_id:
        return None
    return User.objects.filter(id=user_id).first()


def health_check(request):
    if request.method != "GET":
        return JsonResponse({"detail": "Method not allowed."}, status=405)

    return JsonResponse(
        {
            "status": "ok",
            "service": "styroform-core",
            "timestamp": timezone.now().isoformat(),
        }
    )


def public_config(request):
    if request.method != "GET":
        return JsonResponse({"detail": "Method not allowed."}, status=405)

    content = AppContent.objects.filter(is_active=True).first()

    if not content:
        return JsonResponse(
            {
                "site_name": "Styroform",
                "hero_title": "Build, Share, Collect Effortlessly.",
                "hero_subtitle": "Build fast forms and collect responses with Styroform.",
                "hero_cta_text": "Explore Forms",
                "source": "defaults",
            }
        )

    return JsonResponse(
        {
            "site_name": content.site_name,
            "hero_title": content.hero_title,
            "hero_subtitle": content.hero_subtitle,
            "hero_cta_text": content.hero_cta_text,
            "source": "database",
            "updated_at": content.updated_at.isoformat(),
        }
    )


def dashboard_stats(request):
    if request.method != "GET":
        return JsonResponse({"detail": "Method not allowed."}, status=405)

    user = _authenticated_user(request)
    if not user:
        return JsonResponse({"detail": "Authentication required."}, status=401)

    return JsonResponse(
        {
            "users_total": User.objects.count(),
            "forms_total": Form.objects.count(),
            "my_forms_total": Form.objects.filter(owner=user).count(),
            "generated_at": timezone.now().isoformat(),
        }
    )
