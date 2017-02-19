from rest_framework import generics
from rest_framework import permissions
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


class TaskListCreateAPIView(
        generics.ListCreateAPIView):
    serializer_class = serializers.TaskSerializer
    filter_backends = (filters.IsOwnerFilterBackend,)


class TaskRetrieveUpdateDestroyAPIView(
        generics.UpdateAPIView,
        generics.DestroyAPIView):
    serializer_class = serializers.TaskSerializer
    filter_backends = (filters.IsOwnerFilterBackend,)


class TomatoListCreateAPIView(
        generics.ListCreateAPIView):
    serializer_class = serializers.TomatoSerializer
    filter_backends = (filters.IsOwnerFilterBackend,)
