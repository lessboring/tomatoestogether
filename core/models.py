from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import UserManager
from timezone_field import TimeZoneField


class User(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255, blank=True)
    tomato_break_iframe_url = models.CharField(max_length=255, blank=True)
    timezone = TimeZoneField(default='America/New_York')

    USERNAME_FIELD = 'email'

    objects = UserManager()


class Tomato(models.Model):
    """
    A unit of 25 minutes of work, followed by 5 minutes of break.

    For now a tomato is synchronized to the hour and half hour.
    """
    user = models.ForeignKey(User, related_name='tomatoes')
    start = models.DateTimeField()


class Task(models.Model):
    user = models.ForeignKey(User, related_name='tasks')
    parent = models.ForeignKey('self', related_name='children', null=True, blank=True)
    title = models.CharField(max_length=255)
    body = models.TextField(max_length=1000, blank=True)
    completed = models.BooleanField(default=False)
    tomato = models.ForeignKey(Tomato, related_name='tasks', null=True, blank=True)
