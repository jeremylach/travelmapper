# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0002_auto_20150308_0425'),
    ]

    operations = [
        migrations.RenameField(
            model_name='photomoment',
            old_name='location_id',
            new_name='location',
        ),
    ]
