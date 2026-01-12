from django.urls import path

from . import views

urlpatterns = [
    path("portraits/", views.index, name="portraits"),
]