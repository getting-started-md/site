---
number: 1
title: Python & Flask
date: 2015-03-22 18:18:57 -0500
repo: https://github.com/getting-started-md/python-flask
---

## Background

Flask is a lightweight web development framework for python.

It is basically just a router and views. 

In this guide we will walk through getting started with python and flask, and build a simple site.

## Installing Python

This guide will focus on OSX.

OSX 10.10 ships with Python 2.7.6

This guide will just use the built in python.

If you want to install a different python use Homebrew.

Installing python with homebrew can be done with `brew install python`


## Installing Pip

Pip is python's package manager. It is similar to `gem` if you are coming from ruby.

Pip can be installed with

`curl https://bootstrap.pypa.io/get-pip.py -o - | sudo python`

## Install Virtualenv

Virtualenv is a sandboxed python environment. This comes in handy when we want to install multiple versions of pip packages for different projects. If you are a ruby user this would be similar to bundler or rvm.

Virtualenv can be installed with

`sudo pip install virtualenv`


## Setup the project

First we want to create a folder for our project.

I put my project files in `~/projects` so I would type

```bash
$ mkdir flask-demo
$ cd flask-demo
```

Now that we have create a folder for our project we will create a virtual environment.

`virtualenv venv`

will create a virtual environment in folder named venv.

To activate this virtual environment we can type

`source venv/bin/activate`

## Installing Flask

Now that we have python installed, pip working, and a dedicated virtual environment for our project we can finally install Flask.

Using pip this is easy

`sudo pip install Flask`


## Create an Application module

In your project folder create a new folder with the name of your application.

`mkdir flask_demo`

**Sidenote:** If you put hyphens in your module name you are going to have a bad time.

The loading point of this module is defined in **\__init__.py**

**flask_demo/\__init__.py**

```python
from flask import Flask

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'SECRET_KEY'

from flask_demo import routes

```

The first line imports Flask from the flask module. This allows it to be used in `app = Flask(__name__)`.

The last last line in this file loads our application routes.


**flask_demo/routes.py**

```python
from flask import render_template
from flask_demo import app 

@app.route('/')
def index():
  message = "Hello World"
    return render_template('index.html', message=message)
```

The imported routes file above sets up an index route and loads index.html from the templates folder.

The important import to notice here is the render_template function which takes a template from the tempaltes folder and uses it to generate html at the route.

In this example we've set a variable message to "Hello world" and then passed it as a local variable to our template.

## A brief moment on Templates

Flask ships with jinja2 for templates. Check their website for information on syntax and layout.

[http://jinja.pocoo.org/](ttp://jinja.pocoo.org/)

For our application we will just a create a simple index.html template.

**templates/index.html**

```html
  <h1>
    {{ message }}
  </h1>
```

This will render a template with a h1 tag containing the message variable we bound in our route.



## Server

First create a main file for your app. This will be your server.

**server.py**

```python
#!venv/bin/python 
from flask_demo import app

if __name__ == '__main__':
  app.debug = True
  app.run('0.0.0.0', 5000)

```

The code above will create a server listening on all ip addresses on port 5000.


## Run it!

The server can be started with 

`python server.py`

or if you make server.py executable

`chmod +x server.py`

Simply type:

`./server.py`

Now just open your web browser to

`http://127.0.0.1:5000`