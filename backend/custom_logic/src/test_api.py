import requests
import json

def get_projects():
    response = requests.get("http://localhost:8000/api/projects/")
    print("Response code for projects: {}".format(response.status_code))
    return response.json()

def fill_database_with_data():
    with open('/home/banke/Projects/BachelorProject/map-granted-applications/backend/custom_logic/src/Project-2020-02-07.json') as f:
        data = json.load(f)
    for project in data:
        requests.post("http://localhost:8000/api/projects/", project)
    return