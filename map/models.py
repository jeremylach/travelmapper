from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
#from social_auth.models import AuthSocialUser

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
    def get_moments_json():#, social_user):
        moments = PhotoMoment.objects.all().order_by("-created")
        moments_json = []
        if moments:
            for m in moments:
                moments_json.append({"location":{"lat": m.lat, "lng": m.lng}, "name": str(m.name)})

        return moments_json
        
        
