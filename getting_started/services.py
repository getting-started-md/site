from flask import render_template, jsonify, request
from getting_started import app
from getting_started import utils
from mailchimp import ListAlreadySubscribedError
import os

@app.route('/mailinglist', methods=['POST'])
def join_mailing():
  email = request.form['email']
  if (email):
    try:
      result = utils.get_mailchimp_api().lists.subscribe(os.getenv('MAILCHIMP_LIST'), {"email": email}, double_optin=False)
    except ListAlreadySubscribedError, e:
      error = jsonify({"error": str(e)})
      error.status_code = 500
      return error
  return jsonify({"status": "ok"})
  