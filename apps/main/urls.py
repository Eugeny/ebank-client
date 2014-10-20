from django.conf.urls import patterns, url, include


urlpatterns = patterns(
    'apps.main.views.main',
    url(r'^$', 'index'),
    url(r'^template/(?P<template_name>.+)$', 'template'),
)

urlpatterns += patterns(
    'apps.main.views.api',
    url(r'^api/get-info$', 'get_info'),
    url(r'^api/erip/tree$', 'erip_tree'),
    url(r'^api/pay$', 'pay'),
)

urlpatterns += patterns(
    'apps.main.views.auth',
    url(r'^auth/login$', '_login'),
    url(r'^auth/logout$', '_logout'),
)
