#!venv/bin/python 

from flask_frozen import Freezer
from getting_started import app

freezer = Freezer(app)

if __name__ == '__main__':
    freezer.freeze()