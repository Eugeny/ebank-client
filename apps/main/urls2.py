from django.conf.urls import patterns, url, include


urlpatterns = patterns(
    'apps.main.views.main',
    url(r'.+', 'index'),
)