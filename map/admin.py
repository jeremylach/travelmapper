from django.contrib import admin
from .models import *

class PhotoMomentAdmin(admin.ModelAdmin):
    list_filter = ("user",)
    list_display = ['user', 'created', 'media_type']

admin.site.register(PhotoMoment, PhotoMomentAdmin)

