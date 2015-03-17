from django.contrib import admin
from .models import *

class PhotoMomentAdmin(admin.ModelAdmin):
    list_filter = ("user",) 

admin.site.register(PhotoMoment, PhotoMomentAdmin)

