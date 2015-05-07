'use strict';

import React from 'react';
import Mailchimp from '../Mailchimp';

export default class GuideItem extends React.Component {

  render() {
    var guide = this.props.guide;
    var renderer = new marked.Renderer();
    renderer.code = function (code, language) {
      code = code.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
       return '&#'+i.charCodeAt(0)+';';
      });
      var languageClass = ""
      if (language) {
        languageClass = "language-" + language
        var grammer = Prism.languages[language];
        if (grammer) {
          code = Prism.highlight(code, grammer)
        }
      }
      return "<pre><code class='" + languageClass + "'>" + code + "</code></pre>";
    };


    var content = marked(guide.content, {renderer: renderer});

    return (
      <div className="container">
        <Mailchimp />
        <div className="guideBody">
          <h1 className="header">
            {guide.metadata.title}
          </h1>
          <a href={guide.metadata.repo}>Github Project</a>
          <p dangerouslySetInnerHTML={{__html: content}}>
          </p>
        </div>
      </div>
    );
  }

}

GuideItem.propTypes = {
};
