from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('profile', views.profile),
    re_path(r'^(?:.*)/?$', views.index),
]