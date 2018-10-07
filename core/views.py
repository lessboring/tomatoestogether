from django.views.generic import TemplateView, CreateView, ListView, UpdateView
from django.urls import reverse_lazy
from django import forms
from django.forms.models import modelform_factory
from django.shortcuts import render

from django.contrib.auth import login, authenticate
from django.contrib.auth.mixins import LoginRequiredMixin

from core.models import User, Project, Tomato, Break


class ModelFormWidgetMixin(object):
    def get_form_class(self):
        return modelform_factory(self.model, fields=self.fields, widgets=self.widgets)


class HomeView(TemplateView):
    template_name = 'home.html'


class UserCreateView(ModelFormWidgetMixin, CreateView):
    template_name = 'user_create.html'
    model = User
    fields = [
        'email',
        'password',
    ]
    widgets = {
        'password': forms.PasswordInput()
    }

    success_url = reverse_lazy('project_list')

    def form_valid(self, form):
        user = form.instance
        user.set_password(form.cleaned_data.get('password'))
        user.save()
        user = authenticate(username=user.email, password=form.cleaned_data.get('password'))
        login(self.request, user)
        return super().form_valid(form)


class ProjectListView(
        LoginRequiredMixin,
        ListView):
    model = Project
    template_name = 'project_list.html'


class ProjectCreateView(
        LoginRequiredMixin,
        CreateView):
    model = Project
    template_name = 'project_form.html'
    fields = [
        'name',
    ]

    success_url = reverse_lazy('project_list')

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)


class ProjectUpdateView(
        LoginRequiredMixin,
        UpdateView):
    model = Project
    template_name = 'project_form.html'
    fields = [
        'name',
    ]

    success_url = reverse_lazy('project_list')


class WorkView(
        LoginRequiredMixin,
        TemplateView):
    template_name = 'work.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        projects = self.request.user.projects.all()
        context['projects'] = [{
            'id': project.id,
            'name': project.name,
        } for project in projects]

        '''
        tomato_data = [{
            'id': tomato.id,
            'project': tomato.project_id,
            'task': tomato.task,
            'start': tomato.start.timestamp() * 1000,
            'duration': tomato.duration,
        } for tomato in tomatoes]

        break_data = [{
            'id': break_.id,
            'task': break_.task,
            'start': break_.start.timestamp() * 1000,
            'duration': break_.duration,
        } for break_ in breaks]
        '''

        context['durations'] = [
            3000,
            1000 * 60 * 5,
            1000 * 60 * 10,
            1000 * 60 * 25,
            1000 * 60 * 50,
            1000 * 60 * 80,
            1000 * 60 * 110,
        ]

        # context['completed'] = sorted(
        #     tomato_data + break_data,
        #     key=lambda c: c['start'],
        # )

        return context


class TomatoCompleteView(
        LoginRequiredMixin,
        CreateView):
    model = Tomato
    template_name = 'todays_tomatoes.html'
    fields = (
        'project',
        'tasks',
        'start',
        'duration',
    )

    def form_valid(self, form):
        form.instance.user = self.request.user
        form.save()
        return render(self.request, 'todays_tomatoes.html')


class BreakCompleteView(
        LoginRequiredMixin,
        CreateView):
    model = Break
    template_name = 'todays_tomatoes.html'
    fields = (
        'task',
        'start',
        'duration',
    )

    def form_valid(self, form):
        form.instance.user = self.request.user
        form.save()
        return render(self.request, 'todays_tomatoes.html')


class TodaysTomatoesListView(
        LoginRequiredMixin,
        TemplateView):
    template_name = 'todays_tomatoes.html'
