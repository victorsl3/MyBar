# accounts/urls.py
from django.urls import path
from . import views
from django.views.generic.base import TemplateView # new
from django.contrib.auth.decorators import login_required


urlpatterns = [
    path('', login_required(TemplateView.as_view(template_name='peoples/map.html')), name='peoples'),
    path('get_peoples', login_required(views.get_peoples), name = "get_peoples"),
]