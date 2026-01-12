from django.urls import path

from . import views

urlpatterns = [
    path("medailles/", views.index, name="medailles"),
]