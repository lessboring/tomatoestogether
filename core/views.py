from django.views import generic
from django.shortcuts import get_object_or_404
from django.core.urlresolvers import reverse_lazy, reverse
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import User, Project, Task, Tomato
from rest_framework import generics
from . import serializers


class ProjectListCreateAPIView(
        generics.ListCreateAPIView):
    serializer_class = serializers.ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)


class ProjectRetrieveUpdateDestroyAPIView(
        generics.ListCreateAPIView):
    serializer_class = serializers.ProjectSerializer


class SignUpView(
        generic.CreateView):
    template_name = 'registration/signup.html'
    model = User
    fields = ['email', 'password']


class ProjectListView(
        LoginRequiredMixin,
        generic.ListView):
    model = Project



class ProjectDetailView(
        LoginRequiredMixin,
        generic.DetailView):
    model = Project


class ProjectCreateView(
        LoginRequiredMixin,
        generic.CreateView):
    model = Project
    fields = ['name']
    success_url = reverse_lazy('project_list')


class ProjectUpdateView(
        LoginRequiredMixin,
        generic.UpdateView):
    model = Project
    fields = ['name']
    success_url = reverse_lazy('project_list')


class TaskCreateView(
        LoginRequiredMixin,
        generic.CreateView):
    model = Task
    fields = ['title', 'body']

    def get_success_url(self):
        return reverse('project_detail', args=[self.kwargs.get('project_id')])

    def get_project(self):
        return get_object_or_404(
            Project,
            pk=self.kwargs.get('project_id')
        )

    def form_valid(self, form):
        form.instance.project = self.get_project()
        form.instance.user = self.request.user
        return super().form_valid(form)


class TaskUpdateView(
        LoginRequiredMixin,
        generic.UpdateView):
    model = Task
    fields = ['title', 'body']

    def get_success_url(self):
        return reverse('project_detail', args=[self.kwargs.get('project_id')])


class TomatoCreateView(
        LoginRequiredMixin,
        generic.CreateView):
    model = Tomato


class TomatoUpdateView(
        LoginRequiredMixin,
        generic.UpdateView):
    model = Tomato
