import json
from django.http import JsonResponse, Http404

from functools import wraps


def api(fx):
    @wraps(fx)
    def wrapper(request, **kwargs):
        body = {}
        if request.body:
            body = json.loads(request.body)
        kwargs.update(body)

        kwargs['client_id'] = request.session.get('client-id', None)

        try:
            response = fx(request, **kwargs)
        except Exception, e:
            response = {
                'error': repr(e),
            }
        return JsonResponse(response)

    return wrapper


@api
def init(request, client_id=None):
    return {
        'clientId': client_id,
    }
