from django.http import HttpResponseRedirect
from django.shortcuts import render

from libs.bank import BankApi


def _login(request):
    if not request.POST:
        request.session['login_redirect'] = request.GET.get('next', '/')
        return render(request, 'main/login.html', {})

    if BankApi().auth(request.POST['id'], request.POST['password']):
        request.session['client-id'] = request.POST['id']

    return HttpResponseRedirect(request.session['login_redirect'])


def _logout(request):
    del request.session['client-id']
    return HttpResponseRedirect('/')
