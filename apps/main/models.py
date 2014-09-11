from datetime import datetime, timedelta

from django.core.cache import cache
from django.conf import settings

from django.db import models
from django.contrib.auth.models import User


class BankAccount (models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User)
    amount = models.IntegerField()

    def __unicode__(self):
        return self.name
