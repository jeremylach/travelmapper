# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('map', '0008_auto_20150528_1944'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tag',
            old_name='text',
            new_name='name',
        ),
    ]
