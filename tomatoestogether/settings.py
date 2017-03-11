import os
import datetime
from django.core.urlresolvers import reverse_lazy
import socket
import getpass

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ADMINS = (
    ('David Colgan', 'david@lessboring.com'),
)

try:
    from .private import SECRET_KEY
except:
    SECRET_KEY = 'secret-key'

try:
    from .private import DB_PASSWORD
except:
    DB_PASSWORD = ''

try:
    from .private import MAILGUN_SMTP_PASSWORD
except:
    MAILGUN_SMTP_PASSWORD = ''

try:
    from .private import MAILGUN_API_KEY
except:
    MAILGUN_API_KEY = ''


HOSTNAME = socket.gethostname()
USER = getpass.getuser()

if HOSTNAME == 'optimism' and USER == 'tomatoestogether':
    DEBUG = False
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
else:
    DEBUG = True
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

ALLOWED_HOSTS = [
    'localhost',
    'tomatoestogether',
    'www.tomatoestogether.com',
    'tomatoestogether.com',
    '*.tomatoestogether.com',
]

INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.staticfiles',
    'django.contrib.contenttypes',
    'rest_framework',
    'test_without_migrations',
    'django_extensions',
    'timezone_field',
    'core',
]

MIDDLEWARE = [
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'tomatoestogether.urls'

WSGI_APPLICATION = 'tomatoestogether.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'tomatoestogether',
        'USER': 'tomatoestogether',
        'PASSWORD': DB_PASSWORD,
        'HOST': '',
        'PORT': '',
        'TEST': {
            'NAME': 'test_tomatoestogether',
            'USER': 'tomatoestogether',
            'PASSWORD': DB_PASSWORD
        },
        'ATOMIC_REQUESTS': True,
    }
}

AUTH_PASSWORD_VALIDATORS = []
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

#SERVER_EMAIL = 'robot@tomatoestogether.com'
#EMAIL_HOST = 'smtp.mailgun.org'
#EMAIL_PORT = 25
#EMAIL_HOST_USER = 'postmaster@mg.tomatoestogether.com'
#EMAIL_HOST_PASSWORD = MAILGUN_SMTP_PASSWORD
#EMAIL_USE_TLS = True

#ADMIN_EMAIL_SENDER = SERVER_EMAIL
#DEFAULT_FROM_EMAIL = SERVER_EMAIL

AUTH_USER_MODEL = 'core.User'
LOGIN_URL = reverse_lazy('login')
LOGIN_REDIRECT_URL = reverse_lazy('project_list')
LOGOUT_URL = reverse_lazy('logout')

STATIC_ROOT = os.path.join(BASE_DIR, 'site-static')
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [
        os.path.join(BASE_DIR, 'templates'),
    ],
    'APP_DIRS': True,
    'OPTIONS': {
        'context_processors': [
            'django.template.context_processors.debug',
            'django.template.context_processors.request',
            'django.contrib.auth.context_processors.auth',
            'django.contrib.messages.context_processors.messages',
        ],
    },
}]


REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    ),
    'TEST_REQUEST_DEFAULT_FORMAT': 'json',
}

JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': datetime.timedelta(days=7),
    'JWT_ALLOW_REFRESH': True,
    'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=7),
    #'JWT_AUTH_HEADER_PREFIX': '',
}

# Disable api metadata if we are on production
if not DEBUG:
    REST_FRAMEWORK['DEFAULT_METADATA_CLASS'] = None
