import sys
from path import path
from django.conf import global_settings

PROJECT_ROOT = path(__file__).abspath().dirname().dirname()
sys.path.insert(0, PROJECT_ROOT / 'libs')
sys.path.insert(0, PROJECT_ROOT / 'apps')

ADMINS = (
    ('Admin', 'john.pankov@gmail.com'),
)

MANAGERS = ADMINS

SITE_ID = 1

SECRET_KEY = 'kdsjfkdjhjhhjhgkdjfhgkdjh'

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

ROOT_URLCONF = 'config.urls'

WSGI_APPLICATION = 'config.wsgi.application'

INSTALLED_APPS = (
    'grappelli',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.admindocs',

    'devserver',
    'south',
    'django_extensions',
    'compressor',
    'tastypie',

    'apps.main',
)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        },
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'console': {
            'level': 'DEBUG',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
        },
    }, 
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}


# -------------------------
# LOCALE
# -------------------------

USE_I18N = False
USE_L10N = False
USE_TZ = True
TIME_ZONE = 'UTC'

# -------------------------
# TEMPLATES
# -------------------------

TEMPLATE_CONTEXT_PROCESSORS = global_settings.TEMPLATE_CONTEXT_PROCESSORS + (
    'apps.main.context.context',
    'django.core.context_processors.request',
)

TEMPLATE_DIRS = (
    PROJECT_ROOT / 'templates/',
)

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)


# -------------------------
# STATIC FILES
# -------------------------

STATIC_ROOT = PROJECT_ROOT / 'public/static'

STATICFILES_DIRS = (
    PROJECT_ROOT / 'static',
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)


# -------------------------
# COMPRESSION
# -------------------------
COMPRESS_PRECOMPILERS = (
    ('text/coffeescript', 'coffee --compile --stdio'),
    ('text/less', 'lessc {infile} {outfile}'),
)


# -------------------------
# CACHING
# -------------------------

LOGIN_REDIRECT_URL = '/'
LOGIN_URL = '/auth/login'
LOGOUT_URL = '/auth/logout'

APPEND_SLASH = False
TASTYPIE_ALLOW_MISSING_SLASH = True

API_LIMIT_PER_PAGE = 0
