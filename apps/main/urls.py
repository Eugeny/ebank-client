from django.conf.urls import patterns, url, include
from django.views.generic import TemplateView

from tastypie.api import Api
from apps.main.api import *

api = Api(api_name='1')
api.register(UserResource())
api.register(BankAccountResource())


urlpatterns = patterns(
    'apps.main.views.main',
    url(r'^$', 'index'),
    url(r'^template/(?P<template_name>.+)$', 'template'),

    url(r'^api/', include(api.urls)),
)

urlpatterns += patterns(
    'apps.main.views.auth',
    url(r'^auth/login$', '_login'),
    url(r'^auth/logout$', '_logout'),
)
