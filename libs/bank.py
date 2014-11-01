import logging
import requests

from django.conf import settings


class BankServerError (Exception):
    def __init__(self, reason, response):
        self.reason = reason
        self.response = response


class BankApi(object):
    def __init__(self):
        self.url = settings.BANK_SERVER_URL

    def request(self, url, post={}):
        logging.info('>> %s%s', self.url, url)
        req = requests.post(self.url + url, data=post)
        logging.info('<< %s', req.text)
        try:
            response = req.json()
        except ValueError:
            raise BankServerError('not-json', req.text)
        if 'error' in response:
            raise BankServerError('returned-error', response)
        return response

    def auth(self, id, password):
        return self.request('client/auth', {
            'clientId': id,
            'password': password,
        }).get('success', False)

    def change_password(self, id, password):
        return self.request('client/auth', {
            'clientId': id,
            'password': password,
        })

    def get_client(self, id):
        return self.request('client/list/%s' % id)

    def get_erip_tree(self):
        return self.request('erip/tree')

    def pay(self, accountId, recipientBank, recipientId, recipientName, recipientAccountId, amount):
        return self.request('payment/pay', {
            'accountId': accountId,
            'recipientBank': recipientBank,
            'recipientId': recipientId,
            'recipientName': recipientName,
            'recipientAccountId': recipientAccountId,
            'amount': amount,
        })
