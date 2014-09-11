import os

from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404

from apps.main.models import Download


def download(request, id=None):
    download = get_object_or_404(Download, id=id)

    resp = HttpResponse('', 'application/octet-stream')

    path = download.path
    if 'icon' in request.GET:
        path = download.icon_path
    else:
        resp['Content-Disposition'] = 'attachment; filename=%s' % os.path.split(path)[1]

    resp['X-Accel-Redirect'] = '/internal/file-stream' + path
    return resp
