from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'acronym', 'title', 'objective', 'rcn', 'status', 'programme', 'topics', 'frameworkProgramme', 'startDate', 'endDate', 'projectUrl', 'totalCost', 'ecMaxContribution', 'call', 'fundingScheme', 'coordinator', 'coordinatorCountry', 'participants','participantCountries')
