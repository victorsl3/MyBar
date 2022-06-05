from django.contrib import admin
from .models import Bar, Detail
# Register your models here.

admin.site.register([Bar, Detail])