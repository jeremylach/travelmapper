from django.shortcuts import render
from django.views.generic import TemplateView
from .models import *
from social_auth.db.django_models import *
from instagram import client, subscriptions
from django.contrib.auth import logout as auth_logout
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


import logging
import traceback
import os
import sys

@method_decorator(csrf_exempt)
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

        logger = logging.getLogger('testlogger')
        logger.info("HOMEPAGE")

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

@method_decorator(csrf_exempt)
def process_user_update(update):
#    print "USER UPDATED!!!!!"
#    print update

    logger = logging.getLogger('testlogger')
    logger.info("process user update")
    logger.info(update)

    key = update['object']
    subscription_id = update['subscription_id']    
    val = update.get('object_id')

    recent_media, social_user = requestMediaByUser( val, subscription_id )
    logger.info(recent_media)
    
    PhotoMoment.process_recent_media(recent_media, social_user)
    
    return HttpResponse("Updated!!!")

@method_decorator(csrf_exempt)
def requestMediaByUser( user_id, subscription_id ):
    logger = logging.getLogger('testlogger')

    social_user = UserSocialAuth.objects.get(uid=user_id)
    access_token = social_user.extra_data['access_token']
    #logger.info("user id")
    #logger.info(user_id)
    api = client.InstagramAPI(access_token=access_token, client_id=settings.INSTAGRAM_CLIENT_ID, client_secret=settings.INSTAGRAM_CLIENT_SECRET)
    media, next = api.user_recent_media(count=20, user_id=user_id)
    #logger.info("api response")
    #logger.info(media)
    return media, social_user


reactor = subscriptions.SubscriptionsReactor()
reactor.register_callback(subscriptions.SubscriptionType.USER, process_user_update)

@method_decorator(csrf_exempt)
def on_realtime_callback(request, subscriber_django_id):
    '''
    Handles the realtime API callbacks
    If request is a GET then we assume that the request is an echo request
    Else we assume that we are receiving data from the source
    '''

    logger = logging.getLogger('testlogger')
    logger.info('Callback View triggered!')

    if request.method == "POST":
        logger.info('Got the Post!')
        raw_response = request.body

        logger.info(request.body)
#        print raw_response
        
        x_hub_signature = request.META.get('HTTP_X_HUB_SIGNATURE')

        logger.info('Got the x_hub_signature!')
        logger.info(x_hub_signature)
       
        try:
            reactor.process(settings.INSTAGRAM_CLIENT_SECRET, raw_response, x_hub_signature)
        
        except Exception as e:
            logger.info("Got error in reactor processing")
            exc_type, exc_value, exc_traceback = sys.exc_info()
            logger.info(repr(traceback.format_exception(exc_type, exc_value,exc_traceback)))

    else:
        logger.info('Got the GET!')
        mode = request.GET.get("hub.mode")
        challenge = request.GET.get("hub.challenge")
        verify_token = request.GET.get("hub.verify_token")
        if challenge:
            response = challenge
            return HttpResponse(response)
        #return redirect('index')

    return HttpResponse("")