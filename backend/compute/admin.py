from django.contrib import admin
from .models import Project # add this

# Register your models here.


class ProjectAdmin(admin.ModelAdmin):  # add this
    list_display = ('title', 'objective') # add this
# class MathAdmin(admin.ModelAdmin):  # add this
#     list_display = ('x', 'y', 'sum') # add this

# Register your models here.
admin.site.register(Project, ProjectAdmin) # add this
# admin.site.register(Math, MathAdmin) # add this
