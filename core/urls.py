from django.conf.urls import url
from core import views
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    url(r'users/$', views.UserCreateAPIView.as_view()),
    url(r'users/me/$', views.UserRetrieveUpdateAPIView.as_view()),

    url(r'auth/token/$', obtain_jwt_token),

    url(r'projects/$', views.ProjectListCreateAPIView.as_view()),
    url(r'projects/(?P<pk>\d+)/$', views.ProjectRetrieveUpdateDestroyAPIView.as_view()),

    url(r'tasks/$', views.TaskListCreateAPIView.as_view()),
    url(r'tasks/(?P<pk>\d+)/$', views.TaskRetrieveUpdateDestroyAPIView.as_view()),

    #url(r'tomatoes/$', views.TomatoListCreateAPIView.as_view()),
]
