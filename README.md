# map-granted-applications
A Bachelor Project in Computer Science. Topic: Map of Granted Application Topics

The application can be tested at <a href="https://moga.banke.dev/"> `https://moga.banke.dev/`</a>. (server has been shutdown)

Uses Python 3.7 for the back-end.
Front-end is using JavaScript and React.

## Running back-end local
Pipenv is used to run the back-end.

To start the server go into `./backend`.

Run the command `pipenv shell`.
If packages are not installed run `pipenv install`.

Then `python manage.py runserver <PORT>`, where `<PORT>` is the port to run the server on. Leave out for the default `8000`.

## Running front-end local
The front-end uses yarn to manage packages.

To start the front-end go into `./frontend`.

Run the command `yarn start`.
If packages are not installed run `yarn install`.

Go to `localhost:<PORT>`, where `<PORT>` is the port the site was started with.

# Dependencies
## Python
    django (version 3)
    djangorestframework
    django-cors-headers
    requests
    scikit-learn
    pandas
    gensim
    flake8

## JavaScript and React
    "@testing-library/jest-dom": "^4.2.4",
    "@testing-library/react": "^9.3.2",
    "@testing-library/user-event": "^7.1.2",
    "index-of-regex": "^1.0.0",
    "react": "^16.13.1",
    "react-autosuggest": "^10.0.2",
    "react-dom": "^16.13.1",
    "react-google-charts": "^3.0.15",
    "react-graph-vis": "^1.0.5",
    "react-scripts": "3.4.1",
    "react-tooltip": "^4.2.6",
    "react-wordcloud": "^1.2.2"
