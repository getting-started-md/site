'use strict';

import React from 'react';
import GuideItem from '../GuideItem';

export default class ContentPage extends React.Component {

  render() {
    var posts = this.props.posts;
    return (
      <div>
        {posts.map(function(object, i){
          return <GuideItem post={object} key={i} />;
        })}
      </div>
    );
  }

}

ContentPage.propTypes = {
  body: React.PropTypes.string.isRequired
};
