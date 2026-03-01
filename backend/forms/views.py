import json

from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from accounts.models import User

from .models import Form, Question


def _authenticated_user(request):
    user_id = request.session.get("user_id")
    if not user_id:
        return None
    return User.objects.filter(id=user_id).first()


def _serialize_question(question):
    return {
        "id": question.id,
        "prompt": question.prompt,
        "question_type": question.question_type,
        "options": question.options,
        "is_required": question.is_required,
        "order": question.order,
    }


def _serialize_form(form, request=None, include_questions=True):
    cover_url = ""
    if form.cover:
        cover_url = request.build_absolute_uri(form.cover.url) if request else form.cover.url

    payload = {
        "id": form.id,
        "owner_id": form.owner_id,
        "owner_username": form.owner.username,
        "title": form.title,
        "description": form.description,
        "cover_url": cover_url,
        "created_at": form.created_at.isoformat(),
        "updated_at": form.updated_at.isoformat(),
    }

    if include_questions:
        payload["questions"] = [_serialize_question(q) for q in form.questions.all()]

    return payload


def _extract_payload(request):
    content_type = request.headers.get("Content-Type", "")
    if "application/json" in content_type:
        try:
            return json.loads(request.body.decode("utf-8") or "{}")
        except json.JSONDecodeError as exc:
            raise ValueError("Invalid JSON payload.") from exc

    return request.POST


def _parse_questions(raw_questions):
    if raw_questions is None:
        return None

    if isinstance(raw_questions, str):
        if not raw_questions.strip():
            return []
        try:
            raw_questions = json.loads(raw_questions)
        except json.JSONDecodeError as exc:
            raise ValueError("Invalid questions payload.") from exc

    if not isinstance(raw_questions, list):
        raise ValueError("Questions payload must be a list.")

    parsed_questions = []
    valid_question_types = set(Question.QuestionType.values)

    for index, item in enumerate(raw_questions):
        if isinstance(item, str):
            prompt = item.strip()
            question_type = Question.QuestionType.SHORT_TEXT
            options = []
            is_required = False
        elif isinstance(item, dict):
            prompt = str(item.get("prompt", item.get("questionText", ""))).strip()
            question_type = str(
                item.get("question_type", item.get("type", Question.QuestionType.SHORT_TEXT))
            )
            if question_type not in valid_question_types:
                question_type = Question.QuestionType.SHORT_TEXT

            options = item.get("options", [])
            if not isinstance(options, list):
                options = []

            is_required = bool(item.get("is_required", item.get("answerRequired", False)))
        else:
            continue

        if not prompt:
            continue

        parsed_questions.append(
            {
                "prompt": prompt,
                "question_type": question_type,
                "options": options,
                "is_required": is_required,
                "order": index,
            }
        )

    return parsed_questions


def _replace_questions(form, questions_payload):
    form.questions.all().delete()
    question_objects = [
        Question(
            form=form,
            prompt=question["prompt"],
            question_type=question["question_type"],
            options=question["options"],
            is_required=question["is_required"],
            order=question["order"],
        )
        for question in questions_payload
    ]
    if question_objects:
        Question.objects.bulk_create(question_objects)


def list_forms(request):
    if request.method != "GET":
        return JsonResponse({"detail": "Method not allowed."}, status=405)

    user = _authenticated_user(request)
    if not user:
        return JsonResponse({"detail": "Authentication required."}, status=401)

    forms = (
        Form.objects.select_related("owner")
        .prefetch_related("questions")
        .order_by("-updated_at")
    )

    mine = str(request.GET.get("mine", "")).lower() in ("1", "true", "yes")
    if mine:
        forms = forms.filter(owner=user)

    return JsonResponse(
        {
            "forms": [
                _serialize_form(form, request=request, include_questions=True)
                for form in forms
            ]
        }
    )


@csrf_exempt
def create_form(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed."}, status=405)

    user = _authenticated_user(request)
    if not user:
        return JsonResponse({"detail": "Authentication required."}, status=401)

    try:
        payload = _extract_payload(request)
    except ValueError as exc:
        return JsonResponse({"detail": str(exc)}, status=400)

    title = str(payload.get("title", "")).strip()
    description = str(payload.get("description", "")).strip()
    if not title:
        return JsonResponse({"detail": "Title is required."}, status=400)

    try:
        parsed_questions = _parse_questions(payload.get("questions")) or []
    except ValueError as exc:
        return JsonResponse({"detail": str(exc)}, status=400)

    with transaction.atomic():
        form = Form.objects.create(
            owner=user,
            title=title,
            description=description,
            cover=request.FILES.get("cover"),
        )
        _replace_questions(form, parsed_questions)

    created_form = (
        Form.objects.select_related("owner").prefetch_related("questions").get(id=form.id)
    )
    return JsonResponse(_serialize_form(created_form, request=request), status=201)


def form_detail(request, form_id):
    if request.method != "GET":
        return JsonResponse({"detail": "Method not allowed."}, status=405)

    user = _authenticated_user(request)
    if not user:
        return JsonResponse({"detail": "Authentication required."}, status=401)

    form = (
        Form.objects.select_related("owner")
        .prefetch_related("questions")
        .filter(id=form_id)
        .first()
    )
    if not form:
        return JsonResponse({"detail": "Form not found."}, status=404)

    return JsonResponse(_serialize_form(form, request=request))


@csrf_exempt
def update_form(request, form_id):
    if request.method not in ("POST", "PUT", "PATCH"):
        return JsonResponse({"detail": "Method not allowed."}, status=405)

    user = _authenticated_user(request)
    if not user:
        return JsonResponse({"detail": "Authentication required."}, status=401)

    form = Form.objects.select_related("owner").filter(id=form_id).first()
    if not form:
        return JsonResponse({"detail": "Form not found."}, status=404)
    if form.owner_id != user.id:
        return JsonResponse({"detail": "You are not allowed to edit this form."}, status=403)

    try:
        payload = _extract_payload(request)
    except ValueError as exc:
        return JsonResponse({"detail": str(exc)}, status=400)

    title = payload.get("title")
    if title is not None:
        parsed_title = str(title).strip()
        if not parsed_title:
            return JsonResponse({"detail": "Title cannot be empty."}, status=400)
        form.title = parsed_title

    description = payload.get("description")
    if description is not None:
        form.description = str(description)

    remove_cover = str(payload.get("remove_cover", "")).lower() in (
        "1",
        "true",
        "yes",
        "on",
    )
    if remove_cover and form.cover:
        form.cover.delete(save=False)
        form.cover = None

    new_cover = request.FILES.get("cover")
    if new_cover:
        if form.cover:
            form.cover.delete(save=False)
        form.cover = new_cover

    questions_updated = False
    parsed_questions = []
    if "questions" in payload:
        try:
            parsed_questions = _parse_questions(payload.get("questions")) or []
        except ValueError as exc:
            return JsonResponse({"detail": str(exc)}, status=400)
        questions_updated = True

    with transaction.atomic():
        form.save()
        if questions_updated:
            _replace_questions(form, parsed_questions)

    updated_form = (
        Form.objects.select_related("owner").prefetch_related("questions").get(id=form.id)
    )
    return JsonResponse(_serialize_form(updated_form, request=request))


@csrf_exempt
def delete_form(request, form_id):
    if request.method not in ("POST", "DELETE"):
        return JsonResponse({"detail": "Method not allowed."}, status=405)

    user = _authenticated_user(request)
    if not user:
        return JsonResponse({"detail": "Authentication required."}, status=401)

    form = Form.objects.filter(id=form_id).first()
    if not form:
        return JsonResponse({"detail": "Form not found."}, status=404)
    if form.owner_id != user.id:
        return JsonResponse({"detail": "You are not allowed to delete this form."}, status=403)

    if form.cover:
        form.cover.delete(save=False)
    form.delete()
    return JsonResponse({"deleted": True, "id": form_id})
