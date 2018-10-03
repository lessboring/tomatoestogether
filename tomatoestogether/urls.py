from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from core import views

urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('create-account/', views.UserCreateView.as_view(template_name='user_create.html'), name='user_create'),

    path('projects/', views.ProjectListView.as_view(), name='project_list'),
    path('projects/create/', views.ProjectCreateView.as_view(), name='project_create'),
    path('projects/<int:pk>/', views.ProjectUpdateView.as_view(), name='project_update'),

    path('work/', views.WorkView.as_view(), name='work'),

    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
