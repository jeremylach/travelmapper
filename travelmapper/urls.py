from django.conf.urls import patterns, include, url
from django.contrib import admin
import map.urls

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'travelmapper.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += map.urls.urlpatterns
