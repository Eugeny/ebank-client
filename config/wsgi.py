import os

os.environ["DJANGO_SETTINGS_MODULE"] = "config.environments.prod"

import django
from django.core.wsgi import get_wsgi_application

django.setup()
application = get_wsgi_application()
