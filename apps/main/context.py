from django.conf import settings


def context(request):
    return {
        'settings': settings,
    }
