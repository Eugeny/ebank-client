from config.settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'ebank_client',
        'USER': 'root',
        'PASSWORD': '123',
        'HOST': 'localhost',
        'PORT': '',
    }
}

DEBUG = True
TEMPLATE_DEBUG = True

# -------------------------
# STATIC FILES
# -------------------------

STATIC_URL = '/static/'
ADMIN_MEDIA_PREFIX = STATIC_URL


# -------------------------
# COMPRESSION
# -------------------------

COMPRESS_ENABLED = False
COMPRESS_CSS_FILTERS = []
COMPRESS_JS_FILTERS = []
COMPRESS_ROOT = "static"

COMPRESS_REBUILD_TIMEOUT = 5

# -------------------------

BANK_SERVER_URL = 'http://195.50.17.107:8040/api/'