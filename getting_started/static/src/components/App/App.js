'use strict';

import React from 'react';
import invariant from 'react/lib/invariant';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import Navbar from '../Navbar';
import Footerbar from '../Footerbar';
import ContentPage from '../ContentPage';
import GuidePage from '../GuidePage';
import NotFoundPage from '../NotFoundPage';

export default class App extends React.Component {

  componentDidMount() {
    window.addEventListener('popstate', this.handlePopState);
    window.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState);
    window.removeEventListener('click', this.handleClick);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.path !== nextProps.path;
  }

  render() {

    var guideMatch = this.props.path.match(/\/guides\/(.*)$/)
    var guidePath = null

    if (guideMatch) {
      guidePath = guideMatch[1]
    }

    if (guidePath) {
      var guide = AppStore.getGuide(guidePath)
      this.props.onSetTitle("Getting Started with " + guide.metadata.title);
      ga('send', 'pageview');
      return (
        <div className="App">
          <Navbar />
          <GuidePage className="container" guide={guide} />
          <Footerbar />
        </div>
      );
    }
    else {
      var page = AppStore.getPage(this.props.path);
      invariant(page !== undefined, 'Failed to load page content.');
      this.props.onSetTitle(page.title);
      ga('send', 'pageview');
      if (page.type === 'notfound') {
        this.props.onPageNotFound();
        return React.createElement(NotFoundPage, page);
      }

      var guides = AppStore.getGuides();

      return (
        <div className="App">
          <Navbar />
          <ContentPage className="container" guides={guides} {...page} />
          <Footerbar />
        </div>
      );
    }
  }

  handlePopState(event) {
    AppActions.navigateTo(window.location.pathname, {replace: !!event.state});
  }

  handleClick(event) {
    if (event.button === 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.defaultPrevented) {
      return;
    }

    // Ensure link
    var el = event.target;
    while (el && el.nodeName !== 'A') {
      el = el.parentNode;
    }
    if (!el || el.nodeName !== 'A') {
      return;
    }

    if (el.getAttribute('download') || el.getAttribute('rel') === 'external') {
      return;
    }

    // Ensure non-hash for the same path
    var link = el.getAttribute('href');
    if (el.pathname === location.pathname && (el.hash || link === '#')) {
      return;
    }

    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) {
      return;
    }

    // Check target
    if (el.target) {
      return;
    }

    // X-origin
    var origin = window.location.protocol + '//' + window.location.hostname +
      (window.location.port ? ':' + window.location.port : '');
    if (!(el.href && el.href.indexOf(origin) === 0)) {
      return;
    }

    // Rebuild path
    var path = el.pathname + el.search + (el.hash || '');

    event.preventDefault();
    AppActions.listGuides(() => {
      AppActions.navigateTo(path);
    });
  }

}

App.propTypes = {
  path: React.PropTypes.string.isRequired,
  onSetTitle: React.PropTypes.func.isRequired,
  onSetMeta: React.PropTypes.func.isRequired,
  onPageNotFound: React.PropTypes.func.isRequired
};
