from django.shortcuts import render
from django.contrib.auth import load_backend, logout, login, authenticate
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect

from apps.main.models import *


def _login(request):
    if not request.POST:
        request.session['login_redirect'] = request.GET.get('next', '/')
        return render(request, 'main/login.html', {})

    try:
        user = ElementsUser.objects.get(username=request.POST['username'], password=request.POST['password'])
    except ElementsUser.DoesNotExist:
        return HttpResponseRedirect('/')


    if user.web_access:
        request.session['elements_user_id'] = user.id
        request.session['user'] = user.username
        request.session.pop('one-time-token-id', None)

        user = User.objects.get(username=('root' if user.admin_access else 'limited'))
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)
   
    return HttpResponseRedirect(request.session['login_redirect'])


def _logout(request):
    logout(request)
    request.session.pop('elements_user_id', None)
    return HttpResponseRedirect('/')


def fast_lane(request, token):
    OneTimeAccessToken.vacuum()

    try:
        token = OneTimeAccessToken.objects.get(token=token)
    except OneTimeAccessToken.DoesNotExist:
        return HttpResponseRedirect('/')

    if token.view_limit_enabled:
        token.view_limit_left -= 1
        token.save()

    OneTimeAccessTokenActivity(
        token=token,
        ip=request.META['HTTP_X_FORWARDED_FOR'],
    ).save()

    request.session['one-time-token-id'] = token.id
    request.session['one-time-token-url'] = token.url
    user = User.objects.get(username='onetime')
    user.backend = 'django.contrib.auth.backends.ModelBackend'
    login(request, user)

    return HttpResponseRedirect(token.url)
