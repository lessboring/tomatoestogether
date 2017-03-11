from rest_framework import serializers
from .models import User, Folder, Project, Task #, Tomato


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        extra_kwargs = {
            'password': {'write_only': True}
        }
        fields = [
            'id', 'email', 'password', 'name',
            'tomato_break_iframe_url',
        ]

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data.get('password'))
        user.save()
        return user

    def update(self, instance, validated_data):
        user = super().update(instance, validated_data)
        password = validated_data.get('password')
        if password:
            user.set_password(password)
            user.save()
        return user


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id',
            'project',
            'parent',
            'title',
            'index',
            'completed',
        ]


class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id',
            'folder',
            'name',
            'tasks',
        ]


class FolderSerializer(serializers.ModelSerializer):
    projects = ProjectSerializer(many=True, read_only=True)

    class Meta:
        model = Folder
        fields = [
            'id',
            'parent',
            'name',
            'projects',
        ]

#class TomatoSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = Tomato
#        fields = [
#            'id', 'start'
#        ]
