from django.shortcuts import render
from rest_framework import viewsets          # add this
from .serializers import ProjectSerializer      # add this
from .models import Project                     # add this

# Create your views here.


class ProjectView(viewsets.ModelViewSet):       # add this
    serializer_class = ProjectSerializer          # add this
    queryset = Project.objects.all()              # add this
