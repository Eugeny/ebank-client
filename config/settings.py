import sys
from path import path
from django.conf import global_settings

PROJECT_ROOT = path(__file__).abspath().dirname().dirname()
sys.path.insert(0, PROJECT_ROOT / 'libs')
sys.path.insert(0, PROJECT_ROOT / 'apps')

MANAGERS = ADMINS = (
    ('Admin', 'john.pankov@gmail.com'),
)

#SITE_ID = 1

SECRET_KEY = 'jhjhkjhkjh'

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

ROOT_URLCONF = 'config.urls'
#WSGI_APPLICATION = 'config.wsgi.application'

WPADMIN = {
    'admin': {
        'title': 'Gamma E-Bank',
        'menu': {
            'top': 'wpadmin.menu.menus.BasicTopMenu',
            'left': 'wpadmin.menu.menus.BasicLeftMenu',
        },
        'dashboard': {
            'breadcrumbs': True,
        },
    }
}

INSTALLED_APPS = (
    'wpadmin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
#    'django.contrib.sites',
#    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.admindocs',

    'devserver',
    'compressor',

    'apps.main',
)

TEST_RUNNER = 'django.test.runner.DiscoverRunner'

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
        '': {
            'handlers': ['console'],
            'level': 'INFO',
        },
        'django.request': {
            'handlers': ['mail_admins', 'console'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}


# -------------------------
# LOCALE
# -------------------------

USE_I18N = True
USE_L10N = True
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


LOGIN_REDIRECT_URL = '/'
LOGIN_URL = '/auth/login'
LOGOUT_URL = '/auth/logout'
