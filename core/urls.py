from django.conf.urls import url
from core import views
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    url(r'auth/token/$', obtain_jwt_token),

    url(r'projects/$', views.ProjectListCreateAPIView.as_view()),
    url(r'projects/(?P<pk>\d+)/$', views.ProjectRetrieveUpdateDestroyAPIView.as_view()),
]
