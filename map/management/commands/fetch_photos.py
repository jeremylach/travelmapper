from django.core.management.base import NoArgsCommand
import datetime
from social_auth.db.django_models import *
from map.models import *
from instagram import client, subscriptions
from django.db.utils import IntegrityError

class Command(NoArgsCommand):
    help = """
           Creates DinetteUserProfiles for all active learners and educators.  Assign them to the appropriate Group too.
           """
    
    def handle_noargs(self, **options):
        social_users = UserSocialAuth.objects.all()

        for social_user in social_users:
            try:
                next_max_id = social_user.extra_data['next_max_id']
            except KeyError:
                next_max_id = 0
                print "no max id found"
            if "access_token" in social_user.extra_data:
                
                #print social_user.__dict__
                access_token = social_user.extra_data['access_token']
                #print access_token

                api = client.InstagramAPI(access_token=access_token)
                if next_max_id == 0:
                    recent_media, next = api.user_recent_media(count=20)
                else:
                    recent_media, next = api.user_recent_media(count=20, max_id=next_max_id)
                print recent_media
                print "+============+"
                print next
                print "**************"
                next_max_id = next.split("max_id=")[1]
                social_user.extra_data['next_max_id'] = next_max_id
                social_user.save()
                photos = []
                content = ""
                for media in recent_media:
                    if hasattr(media, "location"):
                        try:
                            insta_data = PhotoMoment(insta_id=media.id, user=social_user.user, created=media.created_time, standard_resolution=media.get_standard_resolution_url(), thumbnail=media.get_thumbnail_url(), link=media.link, media_type = media.type, lat=media.location.point.latitude, lng=media.location.point.longitude, name=media.location.name, location_id=media.location.id)
                            insta_data.save()
                        except IntegrityError:
                            print "%s already exists" % media.id
                            continue
                    #photos.append('<div style="float:left;">')
                    #if(media.type == 'video'):
                    #    photos.append('<video controls width height="150"><source type="video/mp4" src="%s"/></video>' % (media.get_standard_resolution_url()))
                    #else:
                    #    photos.append('<img src="%s"/>' % (media.get_low_resolution_url()))
                #content += ''.join(photos)
            else:
                print "No access token found for %s" % social_user.user
                return
        
            print "Fetched photos for: %s" % social_user.user

