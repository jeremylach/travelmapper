# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0004_auto_20150306_0114'),
    ]

    operations = [
        migrations.RenameField(
            model_name='photomoment',
            old_name='pub_date',
            new_name='created',
        ),
        migrations.AddField(
            model_name='photomoment',
            name='link',
            field=models.CharField(default='http://google.com', max_length=400),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='photomoment',
            name='standard_resolution',
            field=models.CharField(default='', max_length=400),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='photomoment',
            name='thumbnail',
            field=models.CharField(default='', max_length=400),
            preserve_default=False,
        ),
    ]
