# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0006_photomoment_location_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='photomoment',
            name='caption',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
    ]
