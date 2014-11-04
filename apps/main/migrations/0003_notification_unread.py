# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_auto_20141028_2002'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='unread',
            field=models.BooleanField(default=True, verbose_name=b'Is unread'),
            preserve_default=True,
        ),
    ]
