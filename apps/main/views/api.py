import json
import traceback
import time
from functools import wraps

from django.http import JsonResponse, Http404, HttpResponseForbidden

from apps.main.models import *
from libs.bank import BankApi, BankServerError


class Http401 (Exception):
    pass


class Http403 (Exception):
    pass


def require_login(fx):
    @wraps(fx)
    def wrapper(request, client_id=None, **kwargs):
        if not client_id:
            raise Http401()
        return fx(request, client_id=client_id, **kwargs)

    return wrapper
    

def api(fx):
    @wraps(fx)
    def wrapper(request, **kwargs):
        body = {}
        if request.body:
            body = json.loads(request.body)
        kwargs.update(body)

        kwargs['client_id'] = request.session.get('client-id', None)

        status = 200

        try:
            response = fx(request, **kwargs)
        except Http403:
            return HttpResponseForbidden()
        except Http401:
            return JsonResponse({}, status=401)
        except BankServerError as e:
            response = {
                'error': e.__class__.__name__,
                'error_reason': e.reason,
                'message': e.response['error']['message']
                    if e.response['error'] is not None and e.response['error']['message'] is not None
                    else e.response,
            }
            status = 500
        except Exception as e:
            traceback.print_exc()
            response = {
                'error': e.__class__.__name__,
                'message': str(e),
            }
            status = 500

        return JsonResponse(response, safe=False, status=status)

    return wrapper


@api
def auth_login(request, client_id=None, id=None, password=None):
    if BankApi().auth(id, password):
        request.session['client-id'] = id
    else:
        raise Http403()
    return {'client_id': id}


@api
@require_login
def auth_logout(request, client_id=None):
    request.session.pop('client-id', None)
    return {}


@api
@require_login
def get_info(request, client_id=None):
    return {
        'client': BankApi().get_client(client_id),
    }


@api
@require_login
def get_notifications(request, client_id=None):
    return [x.to_json() for x in Notification.objects.filter(client_id=client_id).all()]


@api
@require_login
def notification_mark_read(request, client_id=None, notificationId=None):
    n = Notification.objects.get(id=notificationId)
    n.unread = False
    n.save()


@api
@require_login
def erip_tree(request, client_id=None):
    return BankApi().get_erip_tree()


@api
@require_login
def get_currency(request, client_id=None):
    return BankApi().get_currency_rates()


@api
@require_login
def pay(request, client_id=None, accountId=None, recipientAccountId=None, amount=None):
    client = BankApi().get_client(client_id)
    if not any(account['id'] == accountId for account in client['accounts']):
        raise Exception('Invalid accountId')
    return BankApi().pay(accountId, recipientAccountId, amount)


@api
@require_login
def erip_pay(request, client_id=None, accountId=None, paymentId=None, fields={}, amount=None):
    client = BankApi().get_client(client_id)
    if not any(account['id'] == accountId for account in client['accounts']):
        raise Exception('Invalid accountId')
    return BankApi().erip_pay(accountId, paymentId, fields, amount)


@api
@require_login
def change_password(request, client_id=None, client_id_to_change=None, old_password=None, new_password=None):
    if not BankApi().auth(client_id_to_change, old_password):
        raise Http403()
    return BankApi().change_password(client_id_to_change, new_password)


@api
@require_login
def payment_report(request, client_id=None, accountId=None, dateFrom=None, dateTo=None, type=None):
    return BankApi().payment_report(accountId, dateFrom or 0, dateTo or str(int(time.time())), type or '')
