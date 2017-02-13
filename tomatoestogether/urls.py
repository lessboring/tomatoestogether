from django.conf.urls import url, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth import views as auth_views
from django.views import generic

urlpatterns = [
    #url(r'^login/$', auth_views.login, name='login'),
    #url(r'^logout/$', auth_views.logout_then_login, name='logout'),

    url(r'^api/v1/', include('core.urls')),
    #url(r'', generic.TemplateView.as_view(template_name='home.html'), name='home'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
