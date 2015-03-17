"""Production settings and globals."""

from base import *

DEBUG = True

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

STATIC_ROOT = 'staticfiles'

SITE_URL = "http://travelmoments.herokuapp.com/"

#STATICFILES_DIRS = (
    #os.path.join(BASE_DIR, 'staticfiles'),
#    os.path.join(PROJECT_DIR, "static"),
#)

STATICFILES_DIRS = (
    #os.path.join(BASE_DIR, "static"),
    #PROJECT_DIR.child("static"),
    os.path.join(PROJECT_DIR, "static"),
    os.path.join(PROJECT_DIR, "static/map"),
)



import logging
logger = logging.getLogger('testlogger')
logger.info('Test logging!')
import sys

########## HOST CONFIGURATION
# See: https://docs.djangoproject.com/en/1.5/releases/1.5/#allowed-hosts-required-in-production
ALLOWED_HOSTS = [".travelmoments.com", ".herokuapp.com"]
########## END HOST CONFIGURATION

INSTAGRAM_CLIENT_ID = '2d4d63d01aa44f80be1dadaa7eefc99f'
INSTAGRAM_CLIENT_SECRET = '91f4882f75bb4d4b8c3f6e890e3cc677'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': ('%(asctime)s [%(process)d] [%(levelname)s] ' +
                       'pathname=%(pathname)s lineno=%(lineno)s ' +
                       'funcname=%(funcName)s %(message)s'),
            'datefmt': '%Y-%m-%d %H:%M:%S'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        }
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'logging.NullHandler',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
            'stream': sys.stdout
        }
    },
    'loggers': {
        'testlogger': {
            'handlers': ['console'],
            'level': 'INFO',
        }
    }
}

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