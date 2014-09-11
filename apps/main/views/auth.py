from django.shortcuts import render
from django.contrib.auth import load_backend, logout, login, authenticate
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect

from apps.main.models import *


def _login(request):
    if not request.POST:
        request.session['login_redirect'] = request.GET.get('next', '/')
        return render(request, 'main/login.html', {})

    user = authenticate(username=request.POST['username'], password=request.POST['password'])
    if user:
        login(request, user)
   
    return HttpResponseRedirect(request.session['login_redirect'])


def _logout(request):
    logout(request)
    return HttpResponseRedirect('/')
