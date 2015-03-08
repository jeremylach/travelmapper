# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0005_auto_20150308_0432'),
    ]

    operations = [
        migrations.AddField(
            model_name='photomoment',
            name='location_id',
            field=models.CharField(max_length=200, blank=True),
            preserve_default=True,
        ),
    ]
