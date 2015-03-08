# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PhotoMoment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('insta_id', models.CharField(unique=True, max_length=200)),
                ('created', models.DateTimeField(verbose_name=b'date published')),
                ('lat', models.FloatField()),
                ('lng', models.FloatField()),
                ('location_id', models.CharField(max_length=200, blank=True)),
                ('standard_resolution', models.CharField(max_length=400)),
                ('thumbnail', models.CharField(max_length=400, blank=True)),
                ('link', models.CharField(max_length=400, blank=True)),
                ('media_type', models.CharField(default=b'photo', max_length=10, choices=[(b'photo', b'Photo'), (b'video', b'Video')])),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
