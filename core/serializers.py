from rest_framework import serializers
from .models import User, Project, Task, Tomato


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']


class ProjectSerializer(serializers.ModelSerializer):
    tasks = serializers.SlugRelatedField(many=True, read_only=True, slug_field='title')
    class Meta:
        model = Project
        fields = ['name', 'tasks']


class TomatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['user', 'start', 'project']


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['title', 'body']
