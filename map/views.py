from django.shortcuts import render
from django.views.generic import TemplateView
from .models import *

class MapView(TemplateView):
    template_name = "map/index.html"

    def get_context_data(self, **kwargs):
        context = super(MapView, self).get_context_data(**kwargs)
        context['moments_data'] = PhotoMoment.get_moments_json()
        return context

# Create your views here.
