from django.db import models

# Create your models here.


class Project(models.Model):
    id = models.TextField(primary_key=True)
    acronym = models.TextField(null=True)
    title = models.TextField()
    objective = models.TextField(null=True)
    rcn = models.TextField(null=True)
    status = models.TextField(null=True)
    programme = models.TextField(null=True)
    topics = models.TextField(null=True)
    frameworkProgramme = models.TextField(null=True)
    startDate = models.TextField(null=True)
    endDate = models.TextField(null=True)
    projectUrl = models.TextField(null=True)
    totalCost = models.TextField(null=True)
    ecMaxContribution = models.TextField(null=True)
    call = models.TextField(null=True)
    fundingScheme = models.TextField(null=True)
    coordinator = models.TextField(null=True)
    coordinatorCountry = models.TextField(null=True)
    participants = models.TextField(null=True)
    participantCountries = models.TextField(null=True)

    def __str__(self):
        return self.title

