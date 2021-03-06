"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include                 # add this
from rest_framework import routers                    # add this
from compute import views                            # add this

router = routers.DefaultRouter()                      # add this
router.register(r'projects', views.ProjectView, 'compute')     # add this

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # add this
    path('api/wordweight/', views.WordWeightView.as_view()),
    path('api/closestvectors/', views.ClosestVectorsView.as_view()),
    path('api/closestprojects/', views.ClosestProjectsView.as_view()),
    path('api/cooccurrencematrix/', views.CooccurrenceMatrix.as_view()),
    path('api/filterobjectives/', views.FilterObjectivesOnWeightsView.as_view()),
    path('api/wordweightsyear/', views.WordWeightYearAllView.as_view()),
    path('api/termscoreyear/', views.WordWeightYearView.as_view()),
    path('api/getallterms/', views.AllTermsView.as_view()),


]
