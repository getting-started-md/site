from flask import render_template, jsonify, request
from getting_started import app
from getting_started import utils
import os

@app.route('/mailinglist', methods=['POST'])
def join_mailing():
  email = request.form['email']
  if (email):
    result = utils.get_mailchimp_api().lists.subscribe(os.getenv('MAILCHIMP_LIST'), {"email": email}, double_optin=False)
  return jsonify({"status": "ok"})
  