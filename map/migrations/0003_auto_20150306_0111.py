# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0002_auto_20150306_0111'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photomoment',
            name='name',
            field=models.CharField(max_length=200, blank=True),
        ),
    ]
