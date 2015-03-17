from django.core.management.base import NoArgsCommand
import datetime
from social_auth.db.django_models import *
from map.models import *
from instagram import client, subscriptions
from django.db.utils import IntegrityError
from django.contrib.sites.models import get_current_site
from django.conf import settings

class Command(NoArgsCommand):
    help = """
           Creates a subscription to new user photos on instagram, saves them to the DB
           """
    
    def handle_noargs(self, **options):
        full_url = settings.SITE_URL
        admin_user = UserSocialAuth.objects.get(user__username="admin")
        access_token = admin_user.extra_data['access_token']
        print access_token
        print settings.INSTAGRAM_CLIENT_SECRET
        print '%shook/instagram/' % full_url

        api = client.InstagramAPI(access_token=access_token, client_id=settings.INSTAGRAM_CLIENT_ID, client_secret=settings.INSTAGRAM_CLIENT_SECRET)
        api.create_subscription(object='user', aspect='media', client_secret=settings.INSTAGRAM_CLIENT_SECRET, client_id=settings.INSTAGRAM_CLIENT_ID, callback_url='%shook/instagram/' % full_url)
