'use strict';

import React from 'react';

export default React.createClass({

  subscribe: function(e) {
    var self = this
    e.preventDefault() 
    var emailAddress = React.findDOMNode(this.refs.mailchimpEmail).value
    var re = /^([\w-\+]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (re.test(emailAddress)) {
      jQuery.post("/mailinglist", {email: emailAddress}).success(function() {
        alert("Thank you for joining");
        $.cookie('hideMailchimp', 'yes', { expires: 365 }); 
        self.forceUpdate()
      }).error(function(error) {
        alert("There was a problem subscribing you to the list.\n" + error.responseJSON.error)
      })
    }
    else {
      alert("Invalid Email Address.")
    }
  },

  dismiss: function(e) {
    e.preventDefault()
    $.cookie('hideMailchimp', 'yes', { expires: 30 });
    this.forceUpdate()
  },

  render: function() {
    if ($.cookie('hideMailchimp') == 'yes') {
      return (<div />)
    }
    else {
      return (
        <div className="mailchimp card">
          <h2>
            Stay up to date on the latest development guides.
          </h2>
          <form className="col s12" onSubmit={this.subscribe}>
            <div className="row">
              <div className="input-field col s12">
                <input ref="mailchimpEmail" id="email" type="text" className="validate" />
                <label for="email">Email</label>
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                <a href="#" className="waves-effect waves-light btn red lighten-2" onClick={this.dismiss}>No Thanks</a>
                <a href="#" className="waves-effect waves-light btn green lighten-2" onClick={this.subscribe}>Subscribe</a>
              </div>
            </div>
          </form>
        </div>
      );
    }
  }
});
