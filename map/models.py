from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
#from social_auth.models import AuthSocialUser
from django.core import serializers

#class MapUser(AbstractUser):
#    userid = models.AutoField(primary_key=True)
#    def __unicode__(self):
#        return self.get_full_name
    #def getsocialuser(self):
    #    test_social_user = UserSocialAuth.objects.filter(user_id=self.id)
    #    if test_social_user:
    #        return test_social_user[0]
    #    else:
    #        return self
    #
    #def get_full_name(self):
    #    print "testing!!!!"
    #    u = self.getsocialuser()
    #    try:
    #        print "user"
    #        print u
    #        return u.extra_data['username']
    #    except AttributeError:
    #        return self.full_name
    #    
    #pass

#class MapUser(models.Model):
#    user = models.ForeignKey(settings.AUTH_USER_MODEL, unique=True)
#    next_max_id = models.FloatField(default=0)

class PhotoMoment(models.Model):
    insta_id = models.CharField(max_length=200, unique=True)
    created = models.DateTimeField('date published')
    lat = models.FloatField()
    lng = models.FloatField()
    name = models.CharField(max_length=200, blank=True)
    location_id = models.CharField(max_length=200, blank=True)
    
    #location = models.ForeignKey(Location) #has insta_id, lat, lng, name

    #city_state = models.CharField(max_length=100)
    #country = models.CharField(max_length=100)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    standard_resolution = models.CharField(max_length=400)
    thumbnail = models.CharField(max_length=400, blank=True)
    link = models.CharField(max_length=400, blank=True)
    media_type = models.CharField(max_length=10, choices=(("photo", 'Photo'), ("video", 'Video')), default="photo")

    def __unicode__(self):
        return self.name

    @staticmethod
    def get_moments_json(username):#, social_user):
        moments = PhotoMoment.objects.filter(user__username=username).order_by("-created")
        moments_json = []
        if moments:
            #for m in moments:
            #    moments_json.append(serializers.serialize("json", m))#{"location":{"lat": m.lat, "lng": m.lng}, "name": m.name.encode('utf-8')})
            moments_json = serializers.serialize('json', moments)

        return moments_json
        
        
    @staticmethod
    def process_recent_media(recent_media, social_user):
        for media in recent_media:
            if hasattr(media, "location"):
                try:
                    insta_data = PhotoMoment(insta_id=media.id, user=social_user.user, created=media.created_time, standard_resolution=media.get_standard_resolution_url(), thumbnail=media.get_thumbnail_url(), link=media.link, media_type = media.type, lat=media.location.point.latitude, lng=media.location.point.longitude, name=media.location.name, location_id=media.location.id)
                    insta_data.save()
                except IntegrityError:
                    print "%s already exists" % media.id
                    continue
                    
