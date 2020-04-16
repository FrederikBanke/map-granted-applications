from django.contrib import admin
from .models import Project # add this

# Register your models here.


class ProjectAdmin(admin.ModelAdmin):  # add this
    list_display = ('title', 'objective') # add this

# Register your models here.
admin.site.register(Project, ProjectAdmin) # add this