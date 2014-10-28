import logging
import requests

from django.conf import settings


class BankApi(object):
    def __init__(self):
        self.url = settings.BANK_SERVER_URL

    def request(self, url, post={}):
        logging.info('>> %s%s', self.url, url)
        req = requests.post(self.url + url, data=post)
        logging.info('<< %s', req.text)
        return req.json()

    def auth(self, id, password):
        return self.request('client/auth', {
            'clientId': id,
            'password': password,
        }).get('success', False)

    def changePassword(self, id, password):
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
