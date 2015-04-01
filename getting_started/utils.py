import mailchimp
import os

def get_mailchimp_api():
    return mailchimp.Mailchimp(os.getenv('MAILCHIMP_KEY'))