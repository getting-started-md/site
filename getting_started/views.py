from flask import render_template
from getting_started import app 

@app.route('/')
def index():
  return render_template('index.html.haml')

@app.route("/<path:path>")
def catch_all(path):
  return render_template('index.html.haml')