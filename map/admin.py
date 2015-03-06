from django.contrib import admin
from .models import *

class PhotoMomentAdmin(admin.ModelAdmin):
    pass

admin.site.register(PhotoMoment, PhotoMomentAdmin)

