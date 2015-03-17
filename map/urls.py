from django.conf.urls import patterns, include, url
from .views import *
from django.conf import settings
from django.contrib.auth import views as auth_views

urlpatterns = patterns('',
    #url(r'^story/$', Index.as_view(), name='index'),
    url(r'^$', MapView.as_view(), name='index'),
    #url(r'^(?P<username>\w+)', MapView.as_view(), name="index"),
    #url(r'^logout/$', 'logout', name='logout')
    url(r'^logout/$', auth_views.logout,
        #{'template_name': 'registration/logout.html'},
        {'next_page': '/'},
        name='auth_logout'),
    url(r'hook/(.*)/$', on_realtime_callback, name='oauth_callback')
)

