'use strict';

import React from 'react';
import GuideItem from '../GuideItem';

export default class ContentPage extends React.Component {

  render() {
    var guides = this.props.guides;
    return (
      <div className="container">
        {guides.map(function(object, i){
          return <div>
            <GuideItem post={object} key={i} />
          </div>;
        })}
        <a href="https://github.com/getting-started-md/site">Contribute a guide on Github</a>
      </div>
    );
  }

}

ContentPage.propTypes = {
};
