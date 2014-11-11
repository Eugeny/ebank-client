from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.template import loader


def index(request):
    return render(
        request,
        'main/index.html',
        {}
    )


def template(request, template_name=None):
    t, o = loader.find_template('partial/' + template_name)
    if t:
        return HttpResponse(open(t.origin.name).read())
    else:
        return Http404()
