from django import template
from django.conf import settings
from social_auth.db.django_models import UserSocialAuth

register = template.Library()

@register.simple_tag
def social_name(user):
    #test_social_user = UserSocialAuth.objects.filter(user_id=user.id)
    test_social_user = user.social_auth.filter(provider="instagram")
    if test_social_user:
        return test_social_user[0].extra_data['username']
    else:
        return user.get_full_name()