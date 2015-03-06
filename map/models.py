from django.db import models
from django.contrib.auth.models import User

class PhotoMoment(models.Model):
    insta_id = models.CharField(max_length=200, unique=True)
    pub_date = models.DateTimeField('date published')
    lat = models.FloatField()
    lng = models.FloatField()
    name = models.CharField(max_length=200, blank=True)
    #city_state = models.CharField(max_length=100)
    #country = models.CharField(max_length=100)
    user = models.ForeignKey(User)

    def __unicode__(self):
        return self.name

    @staticmethod
    def get_moments_json():
        moments = PhotoMoment.objects.all().order_by("-pub_date")
        moments_json = []
        if moments:
            for m in moments:
                moments_json.append({"location":{"lat": m.lat, "lng": m.lng}, "name": str(m.name)})

        return moments_json
        
        
