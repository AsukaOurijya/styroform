import json
from urllib.parse import urlencode

from django.contrib import messages
from django.contrib.auth.hashers import check_password, make_password
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from .models import User

def _frontend_url(path):
    return f"{settings.FRONTEND_URL}{path}"


def _frontend_url_with_query(path, params):
    query = urlencode(params)
    return f"{_frontend_url(path)}?{query}" if query else _frontend_url(path)


def _authenticated_user(request):
    user_id = request.session.get("user_id")
    if not user_id:
        return None
    return User.objects.filter(id=user_id).first()


def _user_payload(user, request=None):
    profile_image_url = ""
    if user.profile_image:
        if request is not None:
            profile_image_url = request.build_absolute_uri(user.profile_image.url)
        else:
            profile_image_url = user.profile_image.url

    return {
        "id": user.id,
        "username": user.username,
        "profile_image_url": profile_image_url,
    }

@csrf_exempt
def register_user(request):
    if request.method != "POST":
        return redirect(_frontend_url("/Register"))

    username = request.POST.get("username", "").strip()
    password = request.POST.get("password", "")

    if not username or not password:
        messages.error(request, "Username and password are required.")
        return redirect(
            _frontend_url_with_query("/Register", {"error": "missing_fields"})
        )

    if User.objects.filter(username=username).exists():
        messages.error(request, "Username already exists.")
        return redirect(
            _frontend_url_with_query("/Register", {"error": "username_exists"})
        )

    User.objects.create(
        username=username,
        password=make_password(password),
    )
    messages.success(request, "Account created successfully. Please log in.")
    return redirect(
        _frontend_url_with_query("/Login", {"notice": "registration_success"})
    )


@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return redirect(_frontend_url("/Login"))

    username = request.POST.get("username", "").strip()
    password = request.POST.get("password", "")

    user = User.objects.filter(username=username).first()
    if not user:
        messages.error(request, "Invalid username or password.")
        return redirect(
            _frontend_url_with_query("/Login", {"error": "invalid_credentials"})
        )

    # Supports both hashed and legacy plain-text passwords.
    password_valid = check_password(password, user.password) or user.password == password
    if not password_valid:
        messages.error(request, "Invalid username or password.")
        return redirect(
            _frontend_url_with_query("/Login", {"error": "invalid_credentials"})
        )

    request.session["user_id"] = user.id
    request.session["username"] = user.username
    return redirect(_frontend_url("/FormList"))


def logout_user(request):
    request.session.flush()
    return redirect(_frontend_url("/"))


def session_status(request):
    user = _authenticated_user(request)
    if not user:
        return JsonResponse({"authenticated": False, "user": None})
    return JsonResponse({"authenticated": True, "user": _user_payload(user, request)})


def current_user(request):
    user = _authenticated_user(request)
    if not user:
        return JsonResponse({"detail": "Authentication required."}, status=401)
    return JsonResponse(_user_payload(user, request))


@csrf_exempt
def update_current_user(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed."}, status=405)

    user = _authenticated_user(request)
    if not user:
        return JsonResponse({"detail": "Authentication required."}, status=401)

    username = ""
    password = ""
    remove_profile_image = False
    profile_image_file = None
    content_type = request.headers.get("Content-Type", "")

    if "application/json" in content_type:
        try:
            payload = json.loads(request.body.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"detail": "Invalid JSON payload."}, status=400)
        username = str(payload.get("username", "")).strip()
        password = str(payload.get("password", ""))
        remove_profile_image = bool(payload.get("remove_profile_image", False))
    else:
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")
        remove_profile_image = request.POST.get("remove_profile_image", "").lower() in (
            "1",
            "true",
            "yes",
            "on",
        )
        profile_image_file = request.FILES.get("profile_image")

    if not username:
        return JsonResponse({"detail": "Username is required."}, status=400)

    username_taken = User.objects.filter(username=username).exclude(id=user.id).exists()
    if username_taken:
        return JsonResponse({"detail": "Username already exists."}, status=409)

    user.username = username
    if password:
        user.password = make_password(password)

    if remove_profile_image and user.profile_image:
        user.profile_image.delete(save=False)
        user.profile_image = None

    if profile_image_file:
        if user.profile_image:
            user.profile_image.delete(save=False)
        user.profile_image = profile_image_file

    user.save()

    request.session["username"] = user.username
    return JsonResponse(_user_payload(user, request))


def explore_redirect(request):
    if _authenticated_user(request):
        return redirect(_frontend_url("/FormList"))
    return redirect(_frontend_url("/Login"))


def account_redirect(request):
    if _authenticated_user(request):
        return redirect(_frontend_url("/AccountPreview"))
    return redirect(_frontend_url("/Login"))
