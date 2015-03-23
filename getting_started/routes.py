from flask import render_template
from getting_started import app 

@app.route('/')
def index():
  message = "Hello World"
  return render_template('index.html.haml', message=message)
