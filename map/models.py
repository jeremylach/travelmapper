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
