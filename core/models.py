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


class Folder(models.Model):
    user = models.ForeignKey(User, related_name='folders')
    parent = models.ForeignKey('self', related_name='children', null=True, blank=True)
    name = models.CharField(max_length=255)


class Project(models.Model):
    user = models.ForeignKey(User, related_name='projects')
    folder = models.ForeignKey(Folder, related_name='projects', null=True, blank=True)
    name = models.CharField(max_length=255)


class Task(models.Model):
    user = models.ForeignKey(User, related_name='tasks')
    project = models.ForeignKey(Project, related_name='tasks')
    parent = models.ForeignKey('self', related_name='children', null=True, blank=True)
    index = models.IntegerField()
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)

    #body = models.TextField(max_length=1000, blank=True)
    #tomato = models.ForeignKey(Tomato, related_name='tasks', null=True, blank=True)


#class Tomato(models.Model):
#    """
#    A unit of 25 minutes of work, followed by 5 minutes of break.
#
#    For now a tomato is synchronized to the hour and half hour.
#    """
#    user = models.ForeignKey(User, related_name='tomatoes')
#    start = models.DateTimeField()
