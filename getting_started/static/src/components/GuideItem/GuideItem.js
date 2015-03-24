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
    var content = marked(post.content)
    return (
      <div>
        <h1>
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
