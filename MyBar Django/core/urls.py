from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import TemplateView # new
from django.contrib.auth.decorators import login_required
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path("accounts/", include("accounts.urls")),
    path("accounts/", include("django.contrib.auth.urls")),
    path('', login_required(TemplateView.as_view(template_name='home.html')), name='home'),
    path('bars/', include('bars.urls')),
    path('peoples/', include('peoples.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)