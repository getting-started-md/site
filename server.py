#!venv/bin/python 
from getting_started import app

if __name__ == '__main__':
  app.debug = True
  app.run('0.0.0.0', 5000)
