from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.generic.base import RedirectView

from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^admin$', RedirectView.as_view(url='/admin/')),
    url(r'^admin/', include(admin.site.urls)),

    url(r'^favicon.ico$', RedirectView.as_view(url='/static/main/images/favicon.ico')),

    url(r'', include('apps.main.urls')),

    url(r'', include('apps.main.urls2')),
)