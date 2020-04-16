import requests

def get_projects():
    response = requests.get("http://localhost:8000/api/projects/")
    print("Response code for projects: {}".format(response.status_code))
    return response.json()

