from django.contrib import admin
from .models import *

class PhotoMomentAdmin(admin.ModelAdmin):
    list_filter = ("user",)
    list_display = ['name', 'user', 'created', 'get_media_type_display']

admin.site.register(PhotoMoment, PhotoMomentAdmin)

class TagAdmin(admin.ModelAdmin):
    pass

admin.site.register(Tag,TagAdmin)

