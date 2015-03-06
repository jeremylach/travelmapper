# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='photomoment',
            name='city',
        ),
        migrations.RemoveField(
            model_name='photomoment',
            name='country',
        ),
        migrations.AddField(
            model_name='photomoment',
            name='name',
            field=models.CharField(default='', max_length=200),
            preserve_default=False,
        ),
    ]
