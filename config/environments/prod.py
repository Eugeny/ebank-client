from config.settings import *
import dj_database_url

DATABASES = {
    'default': dj_database_url.config()
}

DEBUG = True
TEMPLATE_DEBUG = True

# -------------------------
# STATIC FILES
# -------------------------

STATIC_URL = '/static/'
STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'
ADMIN_MEDIA_PREFIX = STATIC_URL


# -------------------------
# COMPRESSION
# -------------------------

COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True
COMPRESS_CSS_FILTERS = []
COMPRESS_JS_FILTERS = []
COMPRESS_ROOT = "static"

COMPRESS_REBUILD_TIMEOUT = 5

# -------------------------

BANK_SERVER_URL = 'http://195.50.17.107:8040/api/'