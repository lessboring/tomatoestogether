from django.conf.urls import url
from core import views

urlpatterns = [
    url(r'signup/$', views.SignUpView.as_view(), name='signup'),

    url(r'projects/$', views.ProjectListView.as_view(), name='project_list'),
    url(r'projects/create/$', views.ProjectCreateView.as_view(), name='project_create'),
    url(r'projects/(?P<pk>\d+)/update/$', views.ProjectUpdateView.as_view(), name='project_update'),
    url(r'projects/(?P<pk>\d+)/$', views.ProjectDetailView.as_view(), name='project_detail'),

    url(r'projects/(?P<project_id>\d+)/tasks/create/$', views.TaskCreateView.as_view(), name='task_create'),
    url(r'projects/(?P<project_id>\d+)/tasks/(?P<pk>\d+)/update/$', views.TaskUpdateView.as_view(), name='task_update'),
]
