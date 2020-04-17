from django.shortcuts import render
from rest_framework import viewsets # add this
from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .models import Project # add this
from .serializers import ProjectSerializer # add this
import sys

# sys.path.insert(1, '/backend/custom_logic/src/')
from custom_logic.src import test_api

# Create your views here.


class ProjectView(viewsets.ModelViewSet):       # add this
    serializer_class = ProjectSerializer          # add this
    queryset = Project.objects.all()              # add this


class MyOwnView(APIView):
    """
    Test API endpoint. It is not to be used in production.
    """
    def get(self, request):
        projects = test_api.get_projects()
        return Response(projects)
    def post(self, request):
        pass
        test_api.fill_database_with_data()
        return Response({"status": "done"})