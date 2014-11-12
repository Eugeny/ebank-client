from django.conf.urls import patterns, url, include


urlpatterns = patterns(
    'apps.main.views.main',
    url(r'^$', 'index'),
    url(r'^template/(?P<template_name>.+)$', 'template'),
    url(r'^report/(?P<account_id>\d+)/(?P<type>\w+)/(?P<date_from>\d+)/(?P<date_to>\d+)/(?P<format>\w+)$', 'report'),
)

urlpatterns += patterns(
    'apps.main.views.api',
    url(r'^api/auth/login$', 'auth_login'),
    url(r'^api/auth/logout$', 'auth_logout'),
    url(r'^api/change-password$', 'change_password'),
    url(r'^api/info$', 'get_info'),
    url(r'^api/currency$', 'get_currency'),
    url(r'^api/notifications$', 'get_notifications'),
    url(r'^api/notification/mark-read$', 'notification_mark_read'),
    url(r'^api/erip/tree$', 'erip_tree'),
    url(r'^api/erip/pay$', 'erip_pay'),
    url(r'^api/pay$', 'pay'),
    url(r'^api/payment/report$', 'payment_report'),
)

urlpatterns += patterns(
    'apps.main.views.bank_api',
    url(r'^bank-api/notify$', 'notify'),
)
