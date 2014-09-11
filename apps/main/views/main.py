from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from apps.main.models import *


@login_required
def index(request):
    return render(
        request,
        'main/index.html',
        {
        }
    )


def template(request, template_name=None):
    try:
        resp = TemplateView.as_view(template_name=template_name)(request)
        resp.render()
        return resp
    except:
        raise Http404()
