from django.db import models

# Create your models here.

class Form(models.Model):
    owner = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="forms",
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    cover = models.ImageField(upload_to="forms/covers/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Question(models.Model):
    class QuestionType(models.TextChoices):
        SHORT_TEXT = "short_text", "Short Text"
        LONG_TEXT = "long_text", "Long Text"
        MULTIPLE_CHOICE = "multiple_choice", "Multiple Choice"
        CHECKBOX = "checkbox", "Checkbox"

    form = models.ForeignKey(
        Form,
        on_delete=models.CASCADE,
        related_name="questions",
    )
    prompt = models.CharField(max_length=500)
    question_type = models.CharField(
        max_length=32,
        choices=QuestionType.choices,
        default=QuestionType.SHORT_TEXT,
    )
    options = models.JSONField(blank=True, default=list)
    is_required = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["form", "order"],
                name="unique_question_order_per_form",
            )
        ]

    def __str__(self):
        return f"{self.form_id} - {self.prompt[:40]}"
