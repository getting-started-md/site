#!venv/bin/python 

import dotenv
import os
from getting_started import app

if os.path.isfile(".env"):
  dotenv.load_dotenv(".env")

if __name__ == '__main__':
  app.debug = True
  app.run('0.0.0.0',  os.getenv('PORT', 5000))
