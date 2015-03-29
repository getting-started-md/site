'use strict';

import React from 'react';
import GuideItem from '../GuideItem';

export default class ContentPage extends React.Component {

  render() {
    var posts = this.props.posts;
    return (
      <div className="container">
        {posts.map(function(object, i){
          return <div>
            <GuideItem post={object} key={i} />
            <div className="divider"></div>
          </div>;
        })}
      </div>
    );
  }

}

ContentPage.propTypes = {
  body: React.PropTypes.string.isRequired
};
