import json

from django.db import models


class Notification (models.Model):
    client_id = models.IntegerField('Client ID', db_index=True)
    content = models.TextField(default='{}')
    timestamp = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return u'Notification for %i at %s' % (self.client_id, self.timestamp)

    def to_json(self):
        return {
            'id': self.id,
            'content': json.loads(self.content),
            'timestamp': self.timestamp,
        }

