'use strict';

import React from 'react';

export default class GuideItem extends React.Component {

  render() {
    var post = this.props.post;
    var postUrl = "/guides/" + post.slug;
    return (
      <a href={postUrl}>
        <div className='card card-horizontal guide-item'>
          <div className="row">
            <div className="col s4">
              <img src="http://flask.pocoo.org/static/logo/flask.png" />
            </div>
            <div className="col s8">
              <h1>{post.metadata.title}</h1>
              <p>{post.metadata.summary}</p>
            </div>
          </div>
        </div>
      </a>
    )
  }

}

GuideItem.propTypes = {
};
