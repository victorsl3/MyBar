# accounts/urls.py
from django.urls import path
from . import views
from django.views.generic.base import TemplateView # new
from django.contrib.auth.decorators import login_required


urlpatterns = [
    path('get_bars', login_required(views.get_bars), name = "get_bars"),
    path('list', login_required((TemplateView.as_view(template_name='bars/list.html'))), name='list'),
    path('bar/<reference>', login_required(views.bar)),
    path('my_bars', login_required(views.my_bars))
]