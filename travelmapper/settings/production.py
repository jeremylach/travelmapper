"""Production settings and globals."""

from base import *

DEBUG = False

#DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
#STATICFILES_STORAGE = 'storages.backends.s3boto.S3BotoStorage'

#UPLOAD_URL = "https://nyxlstory.s3.amazonaws.com/"
#STATIC_URL = "https://nyxlstory.s3.amazonaws.com/"

#AWS_STORAGE_BUCKET_NAME = "nyxlstory"
#AWS_BUCKET_NAME = "nyxlstory"


#STATICFILES_DIRS = ( 
#    PROJECT_DIR.child("static"), 
#)

#DATABASES = {}

#import dj_database_url
#DATABASES['default'] =  dj_database_url.config()
#DATABASES['default']['ENGINE'] = 'django_postgrespool'

import dj_database_url
DATABASES['default'] =  dj_database_url.config()

#STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = Path(__file__).ancestor(3)

#STATIC_ROOT = 'staticfiles'
#STATIC_URL = '/static/'

STATIC_ROOT = 'staticfiles/'


#STATICFILES_DIRS = (
    #os.path.join(BASE_DIR, 'staticfiles'),
#    os.path.join(PROJECT_DIR, "static"),
#)

STATICFILES_DIRS = (
    #os.path.join(BASE_DIR, "static"),
    #PROJECT_DIR.child("static"),
    os.path.join(PROJECT_DIR, "static"),
)



########## HOST CONFIGURATION
# See: https://docs.djangoproject.com/en/1.5/releases/1.5/#allowed-hosts-required-in-production
ALLOWED_HOSTS = [".travelmapper.com", ".herokuapp.com"]
########## END HOST CONFIGURATION

#MIDDLEWARE_CLASSES += (
#    #'django.middleware.cache.UpdateCacheMiddleware',
#    
#    'django.middleware.common.CommonMiddleware',
#    'django.middleware.cache.FetchFromCacheMiddleware',
#)
#
#def get_cache():
#  import os
#  try:
#    os.environ['MEMCACHE_SERVERS'] = os.environ['MEMCACHIER_SERVERS'].replace(',', ';')
#    os.environ['MEMCACHE_USERNAME'] = os.environ['MEMCACHIER_USERNAME']
#    os.environ['MEMCACHE_PASSWORD'] = os.environ['MEMCACHIER_PASSWORD']
#    return {
#      'default': {
#        'BACKEND': 'django_pylibmc.memcached.PyLibMCCache',
#        'TIMEOUT': 500,
#        'BINARY': True,
#        'OPTIONS': { 'tcp_nodelay': True }
#      }
#    }
#  except:
#    return {
#      'default': {
#        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'
#      }
#    }
#
#CACHES = get_cache()
#CACHE_MIDDLEWARE_ANONYMOUS_ONLY = True