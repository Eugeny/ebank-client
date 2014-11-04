import json
from datetime import datetime

from django.db import models


class Notification (models.Model):
    client_id = models.IntegerField('Client ID', db_index=True)
    content = models.TextField(default='{}')
    unread = models.BooleanField('Is unread', default=True)
    timestamp = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return u'Notification for %i at %s' % (self.client_id, self.timestamp)

    def to_json(self):
        return {
            'id': self.id,
            'content': json.loads(self.content),
            'unread': self.unread,
            'timestamp': self.timestamp,
        }

    @classmethod
    def vacuum(cls):
        cls.objects.filter(start__lt=datetime.now()-timedelta(days=60)).delete()
