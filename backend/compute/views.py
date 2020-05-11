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
import custom_logic.src.data_processing as dp



# Create your views here.


class ProjectView(viewsets.ModelViewSet):       # add this
    serializer_class = ProjectSerializer          # add this
    queryset = Project.objects.all()              # add this

class WordWeightView(APIView):
    """
    API for getting weights for some given words.
    """
    def get(self, request):
        return Response({"status": "There is nothing to GET here, use POST"})
    def post(self, request):
        text = request.data['text']
        try:
            user_project = request.data['user_project']
        except KeyError as identifier:
            user_project = None
        return Response(api.word_weights(text, user_project))

class FilterObjectivesOnWeightsView(APIView):
    """
    API for filtereing project objectives using word weights.
    """
    def get(self, request):
        return Response({"status": "There is nothing to GET here, use POST"})
    def post(self, request):
        texts = request.data['texts']
        try:
            weight_dict = request.data['weight_dict']
        except KeyError as identifier:
            weight_dict = None
        return Response(api.filter_objectives_on_weights(texts, weight_dict))

class ClosestProjectsView(APIView):
    """
    API for getting the closest projects to one's own project.
    """
    def get(self, request):
        return Response({"status": "There is nothing to GET here, use POST"})
    def post(self, request):
        # print(type(request.data))
        project = dp.json_to_dataframe(request.data)
        # print(project)
        # return Response({"test": "response"})
        return Response(api.closest_projects(project))

class ClosestVectorsView(APIView):
    """
    API for getting the closest projects as vectors to one's own project.
    """
    def get(self, request):
        return Response({"status": "There is nothing to GET here, use POST"})
    def post(self, request):
        project = dp.json_to_dataframe(request.data)
        return Response(api.closest_vectors(project))

class CooccurrenceMatrix(APIView):
    """
    API for getting a co-occurrence matrix.
    """
    def get(self, request):
        pass
    def post(self, request):
        texts = request.data['texts']
        vocab, matrix = api.co_occurrence_matrix(texts)
        return Response({"vocabulary": vocab, "coOccurrenceMatrix": matrix})