from django.urls import path

from .views import create_form, delete_form, form_detail, list_forms, update_form

urlpatterns = [
    path("", list_forms, name="list_forms"),
    path("create/", create_form, name="create_form"),
    path("<int:form_id>/", form_detail, name="form_detail"),
    path("<int:form_id>/update/", update_form, name="update_form"),
    path("<int:form_id>/delete/", delete_form, name="delete_form"),
]
