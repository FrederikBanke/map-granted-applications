from django.db import models

# Create your models here.


class Project(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    title = models.CharField(max_length=120)
    objective = models.TextField()

    def __str__(self):
        return self.title
