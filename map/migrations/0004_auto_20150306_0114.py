# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0003_auto_20150306_0111'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photomoment',
            name='insta_id',
            field=models.CharField(unique=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='photomoment',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
    ]
