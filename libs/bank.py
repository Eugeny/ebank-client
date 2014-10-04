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
            'id': id,
            'password': password,
        }).get('success', False)
