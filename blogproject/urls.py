from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django admin panel
    path('admin/', admin.site.urls),

    # DRF browsable API auth (login/logout in browser)
    path('api-auth/', include('rest_framework.urls')),

    # All blog API endpoints (prefixed with /api/)
    path('api/', include('blog.urls')),
]

# Serve uploaded media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)