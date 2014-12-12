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
COMPRESS_PRECOMPILERS = (
    ('text/coffeescript', 'vendor/node/bin/node node_modules/coffee-script/bin/coffee --compile --stdio'),
    ('text/less', 'vendor/node/bin/node node_modules/less/bin/lessc {infile} {outfile}'),
)

# -------------------------

BANK_SERVER_URL = 'http://kofi.asmisha.net/api/'

