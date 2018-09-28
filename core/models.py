from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import UserManager
from timezone_field import TimeZoneField


class User(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True)
    timezone = TimeZoneField(default='America/Chicago')

    USERNAME_FIELD = 'email'

    objects = UserManager()


class Project(models.Model):
    user = models.ForeignKey(User, related_name='projects', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)


class Tomato(models.Model):
    user = models.ForeignKey(User, related_name='tomatoes', on_delete=models.CASCADE)
    project = models.ForeignKey(Project, related_name='tomatoes', on_delete=models.CASCADE)
    task = models.CharField(max_length=255)
    start = models.DateTimeField()
    duration = models.DurationField()
