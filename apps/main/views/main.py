import json
import os

from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from apps.main import celery_app
from apps.main.models import *
from apps.media.models import *

from libs.backend import ElementsBackend
from libs.cluster import get_storage_status


@login_required
def index(request):
    if 'one-time-token-id' in request.session:
        if request.path != request.session['one-time-token-url']:
            return HttpResponseRedirect(request.session['one-time-token-url'])

    if request.user and not request.elements_user:
        return HttpResponseRedirect('/auth/logout')
        
    return render(
        request,
        'main/index.html',
        {
        }
    )


def identify(request):
    return HttpResponse(json.dumps({
        'name': 'Elements',
        'version': settings.VERSION,
        'data-root': settings.DATA_ROOT,
    }))


@login_required
def configure_workspaces(request):
    ElementsBackend().workspaces_apply(Workspace.objects.filter(project__active=True).all())
    return HttpResponse('OK')


@login_required
def configure_users(request):
    ElementsBackend().users_apply(ElementsUser.objects.all())
    return HttpResponse('OK')


@login_required
def configure_groups(request):
    ElementsBackend().groups_apply(ElementsGroup.objects.all())
    return HttpResponse('OK')


@login_required
def configure_shares(request):
    ElementsBackend().shares_apply(Share.objects.all())
    return HttpResponse('OK')


@login_required
def request_storage_status(request):
    return HttpResponse(json.dumps(get_storage_status()))


@login_required
def request_snfs_status(request):
    return HttpResponse(json.dumps(ElementsBackend().get_status()))


@login_required
def list_templates(request):
    return HttpResponse(json.dumps(ElementsBackend().list_templates()))


@login_required
def start_workspace_media_scan(request, id=None):
    from apps.media.tasks import scan
    w = Workspace.objects.get(id=id)
    scan.delay(volume_id=w.volume_id, path=w.volume_path)
    return HttpResponse('')


@login_required
def start_media_root_media_scan(request, id=None):
    from apps.media.tasks import scan
    w = MediaRoot.objects.get(id=id)
    scan.delay(volume_id=w.volume_id, path=w.path)
    return HttpResponse('')


def template(request, template_name=None):
    try:
        resp = TemplateView.as_view(template_name=template_name)(request)
        resp.render()
        return resp
    except:
        raise Http404()
