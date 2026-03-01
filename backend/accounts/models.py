from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=128)
    profile_image = models.ImageField(upload_to="profiles/", blank=True, null=True)
