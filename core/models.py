from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import UserManager


class User(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True)

    USERNAME_FIELD = 'email'

    objects = UserManager()


class Project(models.Model):
    name = models.CharField(max_length=255)


class Tomato(models.Model):
    """
    A unit of 25 minutes of work, followed by 5 minutes of break.
    """
    user = models.ForeignKey(User, related_name='tomatoes')
    start = models.DateTimeField()
    project = models.ForeignKey(Project)


class Task(models.Model):
    project = models.ForeignKey(Project, related_name='tasks')
    tomato = models.ForeignKey(Tomato, related_name='tasks', null=True, blank=True)
    user = models.ForeignKey(User, related_name='tasks')
    title = models.CharField(max_length=255)
    body = models.TextField(max_length=1000, blank=True)
