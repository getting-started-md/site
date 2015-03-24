from flask import Flask, url_for
from hamlish_jinja import HamlishTagExtension
import os


app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'SECRET_KEY'



# Determines the destination of the build. Only usefull if you're using Frozen-Flask
app.config['FREEZER_DESTINATION'] = os.path.dirname(os.path.abspath(__file__))+'/../build'

# Function to easily find your assets
# In your template use <link rel=stylesheet href="{{ static('filename') }}">
app.jinja_env.globals['static'] = (
    lambda filename: url_for('static', filename = filename)
)

# add haml
app.jinja_env.add_extension(HamlishTagExtension)

from getting_started import views
from getting_started import api

