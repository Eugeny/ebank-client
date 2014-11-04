from django.http import HttpResponse, Http404

from apps.main.models import *


def notify(request):
    Notification.vacuum()
    Notification.objects.create(
        client_id=int(request.POST['clientId']),
        content=request.POST['content'],
    )
    return HttpResponse('')