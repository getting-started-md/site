/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

import React from 'react';

export default class GuideItem extends React.Component {

  render() {
    var post = this.props.post;
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


    var content = marked(post.content, {renderer: renderer});

    return (
      <div className="guideBody">
        <h1 className="header">
          {post.metadata.title}
        </h1>
        <p dangerouslySetInnerHTML={{__html: content}}>
        </p>
      </div>
    );
  }

}

GuideItem.propTypes = {
};
