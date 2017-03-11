from rest_framework import generics
from rest_framework import permissions
from .models import Folder, Project, Task
from . import filters
from . import serializers


class UserCreateAPIView(
        generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = (permissions.AllowAny,)


class UserRetrieveUpdateAPIView(
        generics.RetrieveUpdateAPIView):
    serializer_class = serializers.UserSerializer

    def get_object(self):
        return self.request.user


class FolderListCreateAPIView(
        generics.ListCreateAPIView):
    serializer_class = serializers.FolderSerializer
    filter_backends = (filters.IsOwnerFilterBackend,)
    queryset = Folder.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FolderRetrieveUpdateDestroyAPIView(
        generics.UpdateAPIView,
        generics.DestroyAPIView):
    serializer_class = serializers.FolderSerializer
    filter_backends = (filters.IsOwnerFilterBackend,)


class ProjectListCreateAPIView(
        generics.ListCreateAPIView):
    serializer_class = serializers.ProjectSerializer
    filter_backends = (filters.IsOwnerFilterBackend,)
    queryset = Project.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProjectRetrieveUpdateDestroyAPIView(
        generics.UpdateAPIView,
        generics.DestroyAPIView):
    serializer_class = serializers.ProjectSerializer
    filter_backends = (filters.IsOwnerFilterBackend,)


class TaskListCreateAPIView(
        generics.ListCreateAPIView):
    serializer_class = serializers.TaskSerializer
    filter_backends = (filters.IsOwnerFilterBackend,)
    queryset = Task.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskRetrieveUpdateDestroyAPIView(
        generics.UpdateAPIView,
        generics.DestroyAPIView):
    serializer_class = serializers.TaskSerializer
    filter_backends = (filters.IsOwnerFilterBackend,)


#class TomatoListCreateAPIView(
#        generics.ListCreateAPIView):
#    serializer_class = serializers.TomatoSerializer
#    filter_backends = (filters.IsOwnerFilterBackend,)
#
#    def perform_create(self, serializer):
#        serializer.save(user=self.request.user)


#class OperationsHandleAPIView():
