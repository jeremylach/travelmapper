from django.shortcuts import render
from django.views.generic import TemplateView
from .models import *
from instagram import client, subscriptions
from django.contrib.auth import logout as auth_logout
from instagram import client, subscriptions
from django.conf import settings
from django.http import HttpResponse


import traceback
import os
import sys

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
        #context['moments_data'] = PhotoMoment.get_moments_json()

        if 'username' in self.kwargs:
            target_username = self.kwargs['username']
            context['username'] = target_username
        elif not self.request.user.is_anonymous() and self.request.user.is_authenticated():
            target_username = self.request.user.username
        else:
            context['moments_data'] = []
            return context
            #social_user = self.request.user.social_auth.get(provider="instagram")
        all_user_moment_data = PhotoMoment.get_moments_json(target_username)

        context['moments_data'] = all_user_moment_data
            
            #photos = []
            #content = ""
            #for media in recent_media:
                #photos.append('<div style="float:left;">')
                #if(media.type == 'video'):
                #    photos.append('<video controls width height="150"><source type="video/mp4" src="%s"/></video>' % (media.get_standard_resolution_url()))
                #else:
                #    try:
                #        named_location = media.location.name
                #    except AttributeError:
                #        named_location = ""
                #    photos.append('<img src="%s" alt="%s"/>' % (media.get_low_resolution_url(), named_location))
                #photos.append("</div>")
                    #print media.location.__dict__
            #content += ''.join(photos)
            
            #context['photos'] = content #Map.get_moments_json(social_user)
        #else:
        #    context['photos'] = "log in!"
        return context


        #url = unauthenticated_api.get_authorize_url(scope=["likes","comments"])
        #return '<a href="%s">Connect with Instagram</a>' % url


def logout(request):
    auth_logout(request)
    return redirect('index')


def process_user_update(update):
    print "USER UPDATED!!!!!"
    print update

    key = update['object']
    subscription_id = update['subscription_id']    
    val = update.get('object_id')

    requestMediaByUser( val, subscription_id )

    return HttpResponse("Updated!!!")

def requestMediaByUser( user_id, subscription_id ):
	media, next = api.user_recent_media( 20, 0, user_id)


reactor = subscriptions.SubscriptionsReactor()
reactor.register_callback(subscriptions.SubscriptionType.USER, process_user_update)

def on_realtime_callback(request):
    #print request.GET
    print >> sys.stderr, repr(traceback.format_exception(exc_type, exc_value,exc_traceback))
    mode = request.GET.get("hub.mode")
    challenge = request.GET.get("hub.challenge")
    verify_token = request.GET.get("hub.verify_token")
    if challenge:
        response = challenge
        return HttpResponse(response)
        #return redirect('index')
    else:

        #return HttpResponse("POSTED!")

        x_hub_signature = request.META.get('HTTP_X_HUB_SIGNATURE')
        
        raw_response = request.body.read()
    
        #try:
        reactor.process(settings.INSTAGRAM_CLIENT_SECRET, raw_response, x_hub_signature)
        #except Exception as e:
         #   print >> sys.stderr, "Got error in reactor processing"
          #  exc_type, exc_value, exc_traceback = sys.exc_info()
           # print >> sys.stderr, repr(traceback.format_exception(exc_type, exc_value,exc_traceback))

#       raw_response = request.body
#        try:
#            reactor.process(settings.INSTAGRAM_CLIENT_SECRET, raw_response, x_hub_signature)
#        except subscriptions.SubscriptionVerifyError:
#            return HttpResponse("Signature Mismatch")

    return HttpResponse("")



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