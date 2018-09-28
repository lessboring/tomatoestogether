from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from timezone_field import TimeZoneField
from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


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
