'use strict';

import React from 'react';

export default class Navbar extends React.Component {

  render() {
    return (
      <nav>
        <div class="nav-wrapper">
          <a href="/" className="brand-logo left">Getting-Started.md</a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><a href="/">Guides</a></li>
            <li><a href="http://struct.tv">Chat Live</a></li>
          </ul>
        </div>
      </nav>
    );
  }

}
