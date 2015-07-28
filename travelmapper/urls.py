from django.conf.urls import patterns, include, url
from django.contrib import admin
import map.urls

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'travelmapper.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^admin/', include(admin.site.urls)),    
    
    
    url(r'', include('social_auth.urls')),
    url(r'^', include('map.urls')),
)

urlpatterns += patterns('loginas.views',
    url(r"^login/user/(?P<user_id>.+)/$", "user_login", name="loginas-user-login"),
)

#urlpatterns += map.urls.urlpatterns

#from django.contrib.staticfiles.urls import staticfiles_urlpatterns
#urlpatterns += staticfiles_urlpatterns()


#import django_cron
#print dir(django_cron)
#django_cron.autodiscover()