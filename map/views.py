from django.shortcuts import render
from django.views.generic import TemplateView
from .models import *
from instagram import client, subscriptions
from django.contrib.auth import logout as auth_logout


class MapView(TemplateView):
    template_name = "map/index.html"

    #CONFIG = {
    #    'client_id': '5da02e2d2c14451593b35812ee2282e9',
    #    'client_secret': '93a7cb4bfb134a1a86e3491b36ce7909',
    #    'redirect_uri': 'http://127.0.0.1:8000/oauth_callback'
    #}

    #unauthenticated_api = client.InstagramAPI(**CONFIG)

    def get_context_data(self, **kwargs):
        context = super(MapView, self).get_context_data(**kwargs)
        context['moments_data'] = PhotoMoment.get_moments_json()
        return context


        #url = unauthenticated_api.get_authorize_url(scope=["likes","comments"])
        #return '<a href="%s">Connect with Instagram</a>' % url


def logout(request):
    auth_logout(request)
    return redirect('/')

#class InstagramAuth():
#    code = request.GET.get("code")
#    if not code:
#        return 'Missing code'
#    try:
#        access_token, user_info = unauthenticated_api.exchange_code_for_access_token(code)
#        if not access_token:
#            return 'Could not get access token'
#        api = client.InstagramAPI(access_token=access_token)
#        request.session['access_token'] = access_token
#        print ("access token="+access_token)
#    except Exception as e:
#        print(e)
#    return get_nav()