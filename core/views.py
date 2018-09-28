from django.views.generic import TemplateView, CreateView, ListView, UpdateView
from django.urls import reverse_lazy
from django import forms
from django.forms.models import modelform_factory

from django.contrib.auth import login, authenticate
from django.contrib.auth.mixins import LoginRequiredMixin

from core.models import User, Project, Tomato


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
