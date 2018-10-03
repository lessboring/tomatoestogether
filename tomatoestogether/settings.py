import os
from django.urls import reverse_lazy
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

DEBUG = True

ALLOWED_HOSTS = []

if HOSTNAME == 'optimism' and USER == 'tomatoestogether':
    DEBUG = False
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
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
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'timezone_field',
    'widget_tweaks',
    'webpack_loader',
    'core',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'tomatoestogether.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates')
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
    },
]

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

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'public')

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
    os.path.join(BASE_DIR, 'dist'),
]

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': '',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
    }
}

AUTH_USER_MODEL = 'core.User'

LOGIN_REDIRECT_URL = reverse_lazy('project_list')
LOGIN_URL = reverse_lazy('login')
