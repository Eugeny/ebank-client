from config.settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'elements_web',
        'USER': 'root',
        'PASSWORD': '123',
        'HOST': 'localhost',
        'PORT': '',
    }
}

DEBUG = True


# -------------------------
# STATIC FILES
# -------------------------

STATIC_URL = '/static/'
ADMIN_MEDIA_PREFIX = STATIC_URL


# -------------------------
# COMPRESSION
# -------------------------

COMPRESS_ENABLED = True
COMPRESS_CSS_FILTERS = []
COMPRESS_JS_FILTERS = []
COMPRESS_ROOT = "static"

COMPRESS_REBUILD_TIMEOUT = 5

ELEMENTS_INFO_PATH = 'elements.info.json'
