from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),     # ✅ Do NOT remove
    path('', include('app.urls')),       # ✅ Your app's URLs
]

urlpatterns += static('/assets/', document_root=settings.STATICFILES_DIRS[0])
