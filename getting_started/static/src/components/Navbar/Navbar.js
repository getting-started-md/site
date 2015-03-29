'use strict';

import React from 'react';

export default class Navbar extends React.Component {

  render() {
    return (
      <nav>
        <div class="nav-wrapper">
          <a href="/" className="brand-logo left">Getting-Started</a>
          <a href="#" data-activates="mobile-demo" class="button-collapse right"><i class="mdi-navigation-menu"></i></a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><a href="/">Guides</a></li>
            <li><a href="http://struct.tv">Chat Live</a></li>
          </ul>
          <ul className="side-nav" id="mobile-nav">
            <li><a href="/">Guides</a></li>
            <li><a href="http://struct.tv">Chat Live</a></li>
          </ul>
        </div>
      </nav>
    );
  }

}
