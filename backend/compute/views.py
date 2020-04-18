from django.shortcuts import render
from rest_framework import viewsets # add this
from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .models import Project # add this
from .serializers import ProjectSerializer # add this
import sys

# sys.path.insert(1, '/backend/custom_logic/src/')
from custom_logic.src import api

# Create your views here.


class ProjectView(viewsets.ModelViewSet):       # add this
    serializer_class = ProjectSerializer          # add this
    queryset = Project.objects.all()              # add this

class WordWeightView(APIView):
    """
    """
    def get(self, request):
        return Response({"status": "There is nothing to GET here, use POST"})
    def post(self, request):
        print("WordCloud POST request")
        text = request.data['text']
        try:
            user_project = request.data['user_project']
        except KeyError as identifier:
            user_project = None
        word_dict = api.word_weights(text, user_project)
        return Response(word_dict)
        # return Response({"test":"stuff"})


class MyOwnView(APIView):
    """
    Test API endpoint. It is not to be used in production.
    """
    def get(self, request):
        projects = api.get_projects()
        return Response(projects)
    def post(self, request):
        pass
        api.fill_database_with_data()
        return Response({"status": "done"})