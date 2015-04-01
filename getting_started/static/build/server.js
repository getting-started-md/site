module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var _ = _interopRequire(__webpack_require__(9));
  
  var fs = _interopRequire(__webpack_require__(24));
  
  var path = _interopRequire(__webpack_require__(26));
  
  var express = _interopRequire(__webpack_require__(21));
  
  var React = _interopRequire(__webpack_require__(1));
  
  var Dispatcher = _interopRequire(__webpack_require__(4));
  
  var ActionTypes = _interopRequire(__webpack_require__(2));
  
  var AppStore = _interopRequire(__webpack_require__(6));
  
  var server = express();
  
  server.set("port", process.env.PORT || 9999);
  server.use(express["static"](path.join(__dirname)));
  
  //
  // Page API
  // -----------------------------------------------------------------------------
  server.get("/api/page/*", function (req, res) {
    var urlPath = req.path.substr(9);
    var page = AppStore.getPage(urlPath);
    res.send(page);
  });
  
  //
  // Server-side rendering
  // -----------------------------------------------------------------------------
  
  // The top-level React component + HTML template for it
  var App = React.createFactory(__webpack_require__(11));
  var templateFile = path.join(__dirname, "templates/index.html");
  var template = _.template(fs.readFileSync(templateFile, "utf8"));
  
  server.get("*", function (req, res) {
    var data = { description: "" };
    var app = new App({
      path: req.path,
      onSetTitle: function onSetTitle(title) {
        data.title = title;
      },
      onSetMeta: function onSetMeta(name, content) {
        data[name] = content;
      },
      onPageNotFound: function onPageNotFound() {
        res.status(404);
      }
    });
    data.body = React.renderToString(app);
    var html = template(data);
    res.send(html);
  });
  
  // Load pages from the `/src/content/` folder into the AppStore
  (function () {
    var assign = __webpack_require__(5);
    var fm = __webpack_require__(23);
    var jade = __webpack_require__(25);
    var sourceDir = path.join(__dirname, "./content");
    var getFiles = (function (_getFiles) {
      var _getFilesWrapper = function getFiles(_x) {
        return _getFiles.apply(this, arguments);
      };
  
      _getFilesWrapper.toString = function () {
        return _getFiles.toString();
      };
  
      return _getFilesWrapper;
    })(function (dir) {
      var pages = [];
      fs.readdirSync(dir).forEach(function (file) {
        var stat = fs.statSync(path.join(dir, file));
        if (stat && stat.isDirectory()) {
          pages = pages.concat(getFiles(file));
        } else {
          // Convert the file to a Page object
          var filename = path.join(dir, file);
          var url = filename.substr(sourceDir.length, filename.length - sourceDir.length - 5).replace("\\", "/");
          if (url.indexOf("/index", url.length - 6) !== -1) {
            url = url.substr(0, url.length - (url.length > 6 ? 6 : 5));
          }
          var source = fs.readFileSync(filename, "utf8");
          var content = fm(source);
          var html = jade.render(content.body, null, "  ");
          var page = assign({}, { path: url, body: html }, content.attributes);
          Dispatcher.handleServerAction({
            actionType: ActionTypes.LOAD_PAGE,
            path: url,
            page: page
          });
        }
      });
      return pages;
    });
    return getFiles(sourceDir);
  })();
  
  server.listen(server.get("port"), function () {
    if (process.send) {
      process.send("online");
    } else {
      console.log("The server is running at http://localhost:" + server.get("port"));
    }
  });

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("react");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var keyMirror = _interopRequire(__webpack_require__(8));
  
  module.exports = keyMirror({
  
    LOAD_GUIDES: null,
    LOAD_GUIDE: null,
    LOAD_PAGE: null,
    LOAD_PAGE_SUCCESS: null,
    LOAD_PAGE_ERROR: null,
    CHANGE_LOCATION: null
  
  });

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var keyMirror = _interopRequire(__webpack_require__(8));
  
  module.exports = keyMirror({
  
    VIEW_ACTION: null,
    SERVER_ACTION: null
  
  });

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var Flux = _interopRequire(__webpack_require__(22));
  
  var PayloadSources = _interopRequire(__webpack_require__(3));
  
  var assign = _interopRequire(__webpack_require__(5));
  
  /**
   * A singleton that operates as the central hub for application updates.
   * For more information visit https://facebook.github.io/flux/
   */
  var Dispatcher = assign(new Flux.Dispatcher(), {
  
    /**
     * @param {object} action The details of the action, including the action's
     * type and additional data coming from the server.
     */
    handleServerAction: function handleServerAction(action) {
      var payload = {
        source: PayloadSources.SERVER_ACTION,
        action: action
      };
      this.dispatch(payload);
    },
  
    /**
     * @param {object} action The details of the action, including the action's
     * type and additional data coming from the view.
     */
    handleViewAction: function handleViewAction(action) {
      var payload = {
        source: PayloadSources.VIEW_ACTION,
        action: action
      };
      this.dispatch(payload);
    }
  
  });
  
  module.exports = Dispatcher;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Copyright 2014-2015, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule Object.assign
   */
  
  // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign
  
  'use strict';
  
  function assign(target, sources) {
    if (target == null) {
      throw new TypeError('Object.assign target cannot be null or undefined');
    }
  
    var to = Object(target);
    var hasOwnProperty = Object.prototype.hasOwnProperty;
  
    for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
      var nextSource = arguments[nextIndex];
      if (nextSource == null) {
        continue;
      }
  
      var from = Object(nextSource);
  
      // We don't currently support accessors nor proxies. Therefore this
      // copy cannot throw. If we ever supported this then we must handle
      // exceptions and side-effects. We don't support symbols so they won't
      // be transferred.
  
      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to[key] = from[key];
        }
      }
    }
  
    return to;
  }
  
  module.exports = assign;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var Dispatcher = _interopRequire(__webpack_require__(4));
  
  var ActionTypes = _interopRequire(__webpack_require__(2));
  
  var PayloadSources = _interopRequire(__webpack_require__(3));
  
  var EventEmitter = _interopRequire(__webpack_require__(20));
  
  var assign = _interopRequire(__webpack_require__(5));
  
  var _ = _interopRequire(__webpack_require__(9));
  
  var CHANGE_EVENT = "change";
  
  var pages = {};
  var guides = [];
  
  var loading = false;
  
  if (true) {
    pages["/"] = { title: "Getting Started guides for every language and framework. Ruby On Rails, Python, Django, PHP, Go, Rust" };
    pages["/privacy"] = { title: "Privacy Policy" };
  }
  
  var AppStore = assign({}, EventEmitter.prototype, {
  
    isLoading: function isLoading() {
      return loading;
    },
  
    /**
     * Gets page data by the given URL path.
     *
     * @param {String} path URL path.
     * @returns {*} Page data.
     */
    getPage: function getPage(path) {
      return path in pages ? pages[path] : {
        title: "Page Not Found",
        type: "notfound"
      };
    },
  
    getGuides: function getGuides() {
      return guides;
    },
  
    getGuide: function getGuide(slug) {
      console.log(guides, slug);
      return _.find(guides, function (g) {
        return g.slug == slug;
      });
    },
  
    /**
     * Emits change event to all registered event listeners.
     *
     * @returns {Boolean} Indication if we've emitted an event.
     */
    emitChange: function emitChange() {
      return this.emit(CHANGE_EVENT);
    },
  
    /**
     * Register a new change event listener.
     *
     * @param {function} callback Callback function.
     */
    onChange: function onChange(callback) {
      this.on(CHANGE_EVENT, callback);
    },
  
    /**
     * Remove change event listener.
     *
     * @param {function} callback Callback function.
     */
    off: function off(callback) {
      this.off(CHANGE_EVENT, callback);
    }
  
  });
  
  AppStore.dispatcherToken = Dispatcher.register(function (payload) {
    var action = payload.action;
  
    switch (action.actionType) {
  
      case ActionTypes.LOAD_PAGE:
        if (action.source === PayloadSources.VIEW_ACTION) {
          loading = true;
        } else {
          loading = false;
          if (!action.err) {
            pages[action.path] = action.page;
          }
        }
        AppStore.emitChange();
        break;
  
      case ActionTypes.LOAD_GUIDES:
        if (action.source === PayloadSources.VIEW_ACTION) {
          loading = true;
        } else {
          loading = false;
          if (!action.err) {
            guides = action.guides;
          }
        }
        AppStore.emitChange();
        break;
  
      default:
      // Do nothing
  
    }
  });
  
  module.exports = AppStore;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Copyright 2013-2015, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule invariant
   */
  
  "use strict";
  
  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments
   * to provide information about what broke and what you were
   * expecting.
   *
   * The invariant message will be stripped in production, but the invariant
   * will remain to ensure logic does not differ in production.
   */
  
  var invariant = function(condition, format, a, b, c, d, e, f) {
    if (true) {
      if (format === undefined) {
        throw new Error('invariant requires an error message argument');
      }
    }
  
    if (!condition) {
      var error;
      if (format === undefined) {
        error = new Error(
          'Minified exception occurred; use the non-minified dev environment ' +
          'for the full error message and additional helpful warnings.'
        );
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(
          'Invariant Violation: ' +
          format.replace(/%s/g, function() { return args[argIndex++]; })
        );
      }
  
      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  };
  
  module.exports = invariant;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Copyright 2013-2015, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule keyMirror
   * @typechecks static-only
   */
  
  'use strict';
  
  var invariant = __webpack_require__(7);
  
  /**
   * Constructs an enumeration with keys equal to their value.
   *
   * For example:
   *
   *   var COLORS = keyMirror({blue: null, red: null});
   *   var myColor = COLORS.blue;
   *   var isColorValid = !!COLORS[myColor];
   *
   * The last line could not be performed if the values of the generated enum were
   * not equal to their keys.
   *
   *   Input:  {key1: val1, key2: val2}
   *   Output: {key1: key1, key2: key2}
   *
   * @param {object} obj
   * @return {object}
   */
  var keyMirror = function(obj) {
    var ret = {};
    var key;
    (true ? invariant(
      obj instanceof Object && !Array.isArray(obj),
      'keyMirror(...): Argument must be an object.'
    ) : invariant(obj instanceof Object && !Array.isArray(obj)));
    for (key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }
      ret[key] = key;
    }
    return ret;
  };
  
  module.exports = keyMirror;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("lodash");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var Dispatcher = _interopRequire(__webpack_require__(4));
  
  var ActionTypes = _interopRequire(__webpack_require__(2));
  
  var PayloadSources = _interopRequire(__webpack_require__(3));
  
  var ExecutionEnvironment = _interopRequire(__webpack_require__(19));
  
  var http = _interopRequire(__webpack_require__(27));
  
  module.exports = {
  
    navigateTo: function navigateTo(path, options) {
      if (ExecutionEnvironment.canUseDOM) {
        if (options && options.replace) {
          window.history.replaceState({}, document.title, path);
        } else {
          window.history.pushState({}, document.title, path);
        }
      }
  
      Dispatcher.handleViewAction({
        actionType: ActionTypes.CHANGE_LOCATION,
        path: path
      });
    },
  
    listGuides: function listGuides(cb) {
  
      Dispatcher.handleViewAction({
        actionType: ActionTypes.LOAD_GUIDES,
        source: PayloadSources.VIEW_ACTION,
        guides: []
      });
  
      http.get("/api/guides").accept("application/json").end(function (err, res) {
        Dispatcher.handleServerAction({
          actionType: ActionTypes.LOAD_GUIDES,
          err: err,
          guides: res.body.guides
        });
        if (cb) {
          cb();
        }
      });
    }
  
  };

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
  
  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
  
  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
  
  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
  
  var React = _interopRequire(__webpack_require__(1));
  
  var invariant = _interopRequire(__webpack_require__(7));
  
  var AppActions = _interopRequire(__webpack_require__(10));
  
  var AppStore = _interopRequire(__webpack_require__(6));
  
  var Navbar = _interopRequire(__webpack_require__(17));
  
  var Footerbar = _interopRequire(__webpack_require__(13));
  
  var ContentPage = _interopRequire(__webpack_require__(12));
  
  var GuidePage = _interopRequire(__webpack_require__(15));
  
  var NotFoundPage = _interopRequire(__webpack_require__(18));
  
  var App = (function (_React$Component) {
    function App() {
      _classCallCheck(this, App);
  
      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }
  
    _inherits(App, _React$Component);
  
    _createClass(App, {
      componentDidMount: {
        value: function componentDidMount() {
          window.addEventListener("popstate", this.handlePopState);
          window.addEventListener("click", this.handleClick);
        }
      },
      componentWillUnmount: {
        value: function componentWillUnmount() {
          window.removeEventListener("popstate", this.handlePopState);
          window.removeEventListener("click", this.handleClick);
        }
      },
      shouldComponentUpdate: {
        value: function shouldComponentUpdate(nextProps) {
          return this.props.path !== nextProps.path;
        }
      },
      render: {
        value: function render() {
  
          var guideMatch = this.props.path.match(/\/guides\/(.*)$/);
          var guidePath = null;
  
          if (guideMatch) {
            guidePath = guideMatch[1];
          }
  
          if (guidePath) {
            var guide = AppStore.getGuide(guidePath);
            this.props.onSetTitle("Getting Started with " + guide.metadata.title);
            ga("send", "pageview");
            return React.createElement(
              "div",
              { className: "App" },
              React.createElement(Navbar, null),
              React.createElement(GuidePage, { className: "container", guide: guide }),
              React.createElement(Footerbar, null)
            );
          } else {
            var page = AppStore.getPage(this.props.path);
            invariant(page !== undefined, "Failed to load page content.");
            this.props.onSetTitle(page.title);
            ga("send", "pageview");
            if (page.type === "notfound") {
              this.props.onPageNotFound();
              return React.createElement(NotFoundPage, page);
            }
  
            var guides = AppStore.getGuides();
  
            return React.createElement(
              "div",
              { className: "App" },
              React.createElement(Navbar, null),
              React.createElement(ContentPage, _extends({ className: "container", guides: guides }, page)),
              React.createElement(Footerbar, null)
            );
          }
        }
      },
      handlePopState: {
        value: function handlePopState(event) {
          AppActions.navigateTo(window.location.pathname, { replace: !!event.state });
        }
      },
      handleClick: {
        value: function handleClick(event) {
          if (event.button === 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.defaultPrevented) {
            return;
          }
  
          // Ensure link
          var el = event.target;
          while (el && el.nodeName !== "A") {
            el = el.parentNode;
          }
          if (!el || el.nodeName !== "A") {
            return;
          }
  
          if (el.getAttribute("download") || el.getAttribute("rel") === "external") {
            return;
          }
  
          // Ensure non-hash for the same path
          var link = el.getAttribute("href");
          if (el.pathname === location.pathname && (el.hash || link === "#")) {
            return;
          }
  
          // Check for mailto: in the href
          if (link && link.indexOf("mailto:") > -1) {
            return;
          }
  
          // Check target
          if (el.target) {
            return;
          }
  
          // X-origin
          var origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
          if (!(el.href && el.href.indexOf(origin) === 0)) {
            return;
          }
  
          // Rebuild path
          var path = el.pathname + el.search + (el.hash || "");
  
          event.preventDefault();
          AppActions.listGuides(function () {
            AppActions.navigateTo(path);
          });
        }
      }
    });
  
    return App;
  })(React.Component);
  
  module.exports = App;
  
  App.propTypes = {
    path: React.PropTypes.string.isRequired,
    onSetTitle: React.PropTypes.func.isRequired,
    onSetMeta: React.PropTypes.func.isRequired,
    onPageNotFound: React.PropTypes.func.isRequired
  };

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
  
  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
  
  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
  
  var React = _interopRequire(__webpack_require__(1));
  
  var GuideItem = _interopRequire(__webpack_require__(14));
  
  var Mailchimp = _interopRequire(__webpack_require__(16));
  
  var ContentPage = (function (_React$Component) {
    function ContentPage() {
      _classCallCheck(this, ContentPage);
  
      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }
  
    _inherits(ContentPage, _React$Component);
  
    _createClass(ContentPage, {
      render: {
        value: function render() {
          var guides = this.props.guides;
          return React.createElement(
            "div",
            { className: "container" },
            React.createElement(Mailchimp, null),
            guides.map(function (object, i) {
              return React.createElement(
                "div",
                null,
                React.createElement(GuideItem, { post: object, key: i })
              );
            }),
            React.createElement(
              "a",
              { href: "https://github.com/getting-started-md/site" },
              "Contribute a guide on Github"
            )
          );
        }
      }
    });
  
    return ContentPage;
  })(React.Component);
  
  module.exports = ContentPage;
  
  ContentPage.propTypes = {};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
  
  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
  
  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
  
  var React = _interopRequire(__webpack_require__(1));
  
  var Footerbar = (function (_React$Component) {
    function Footerbar() {
      _classCallCheck(this, Footerbar);
  
      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }
  
    _inherits(Footerbar, _React$Component);
  
    _createClass(Footerbar, {
      render: {
        value: function render() {
          return React.createElement(
            "footer",
            null,
            React.createElement(
              "div",
              null,
              "Follow us on ",
              React.createElement(
                "a",
                { href: "http://www.twitter.com/structdottv", target: "_blank" },
                "twitter"
              ),
              "  |  ",
              React.createElement(
                "a",
                { href: "http://www.kohactive.com", target: "_blank" },
                "Web Design"
              ),
              " by kohactive"
            )
          );
        }
      }
    });
  
    return Footerbar;
  })(React.Component);
  
  module.exports = Footerbar;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
  
  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
  
  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
  
  var React = _interopRequire(__webpack_require__(1));
  
  var GuideItem = (function (_React$Component) {
    function GuideItem() {
      _classCallCheck(this, GuideItem);
  
      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }
  
    _inherits(GuideItem, _React$Component);
  
    _createClass(GuideItem, {
      render: {
        value: function render() {
          var post = this.props.post;
          var postUrl = "/guides/" + post.slug;
          return React.createElement(
            "a",
            { href: postUrl },
            React.createElement(
              "div",
              { className: "card card-horizontal guide-item" },
              React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                  "div",
                  { className: "col s12 m4" },
                  React.createElement("img", { src: post.metadata.image })
                ),
                React.createElement(
                  "div",
                  { className: "col s12 m8" },
                  React.createElement(
                    "h1",
                    null,
                    post.metadata.title
                  ),
                  React.createElement(
                    "p",
                    null,
                    post.metadata.summary
                  )
                )
              )
            )
          );
        }
      }
    });
  
    return GuideItem;
  })(React.Component);
  
  module.exports = GuideItem;
  
  GuideItem.propTypes = {};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
  
  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
  
  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
  
  var React = _interopRequire(__webpack_require__(1));
  
  var GuideItem = (function (_React$Component) {
    function GuideItem() {
      _classCallCheck(this, GuideItem);
  
      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }
  
    _inherits(GuideItem, _React$Component);
  
    _createClass(GuideItem, {
      render: {
        value: function render() {
          var guide = this.props.guide;
          var renderer = new marked.Renderer();
          renderer.code = function (code, language) {
            code = code.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
              return "&#" + i.charCodeAt(0) + ";";
            });
            var languageClass = "";
            if (language) {
              languageClass = "language-" + language;
              var grammer = Prism.languages[language];
              if (grammer) {
                code = Prism.highlight(code, grammer);
              }
            }
            return "<pre><code class='" + languageClass + "'>" + code + "</code></pre>";
          };
  
          var content = marked(guide.content, { renderer: renderer });
  
          return React.createElement(
            "div",
            { className: "container" },
            React.createElement(
              "div",
              { className: "guideBody" },
              React.createElement(
                "h1",
                { className: "header" },
                guide.metadata.title
              ),
              React.createElement(
                "a",
                { href: guide.metadata.repo },
                "Github Project"
              ),
              React.createElement("p", { dangerouslySetInnerHTML: { __html: content } })
            )
          );
        }
      }
    });
  
    return GuideItem;
  })(React.Component);
  
  module.exports = GuideItem;
  
  GuideItem.propTypes = {};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var React = _interopRequire(__webpack_require__(1));
  
  module.exports = React.createClass({
    displayName: "Mailchimp",
  
    subscribe: function subscribe(e) {
      var self = this;
      e.preventDefault();
      var emailAddress = React.findDOMNode(this.refs.mailchimpEmail).value;
      var re = /^([\w-\+]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      if (re.test(emailAddress)) {
        jQuery.post("/mailinglist", { email: emailAddress }).success(function () {
          alert("Thank you for joining");
          $.cookie("hideMailchimp", "yes", { expires: 365 });
          self.forceUpdate();
        }).error(function (error) {
          alert("There was a problem subscribing you to the list.\n" + error.responseJSON.error);
        });
      } else {
        alert("Invalid Email Address.");
      }
    },
  
    dismiss: function dismiss(e) {
      e.preventDefault();
      $.cookie("hideMailchimp", "yes", { expires: 30 });
      this.forceUpdate();
    },
  
    render: function render() {
      if ($.cookie("hideMailchimp") == "yes") {
        return React.createElement("div", null);
      } else {
        return React.createElement(
          "div",
          { className: "mailchimp card" },
          React.createElement(
            "h2",
            null,
            "Stay up to date on the latest development guides."
          ),
          React.createElement(
            "form",
            { className: "col s12", onSubmit: this.subscribe },
            React.createElement(
              "div",
              { className: "row" },
              React.createElement(
                "div",
                { className: "input-field col s12" },
                React.createElement("input", { ref: "mailchimpEmail", id: "email", type: "text", className: "validate" }),
                React.createElement(
                  "label",
                  { "for": "email" },
                  "Email"
                )
              )
            ),
            React.createElement(
              "div",
              { className: "row" },
              React.createElement(
                "div",
                { className: "col s12" },
                React.createElement(
                  "a",
                  { href: "#", className: "waves-effect waves-light btn red lighten-2", onClick: this.dismiss },
                  "No Thanks"
                ),
                React.createElement(
                  "a",
                  { href: "#", className: "waves-effect waves-light btn green lighten-2", onClick: this.subscribe },
                  "Subscribe"
                )
              )
            )
          )
        );
      }
    }
  });

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
  
  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
  
  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
  
  var React = _interopRequire(__webpack_require__(1));
  
  var Navbar = (function (_React$Component) {
    function Navbar() {
      _classCallCheck(this, Navbar);
  
      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }
  
    _inherits(Navbar, _React$Component);
  
    _createClass(Navbar, {
      render: {
        value: function render() {
          return React.createElement(
            "nav",
            null,
            React.createElement(
              "div",
              { "class": "nav-wrapper" },
              React.createElement(
                "a",
                { href: "/", className: "brand-logo left" },
                "Getting-Started"
              ),
              React.createElement(
                "a",
                { href: "#", "data-activates": "mobile-demo", "class": "button-collapse right" },
                React.createElement("i", { "class": "mdi-navigation-menu" })
              ),
              React.createElement(
                "ul",
                { id: "nav-mobile", className: "right hide-on-med-and-down" },
                React.createElement(
                  "li",
                  null,
                  React.createElement(
                    "a",
                    { href: "/" },
                    "Guides"
                  )
                ),
                React.createElement(
                  "li",
                  null,
                  React.createElement(
                    "a",
                    { href: "http://struct.tv" },
                    "Chat Live"
                  )
                )
              ),
              React.createElement(
                "ul",
                { className: "side-nav", id: "mobile-nav" },
                React.createElement(
                  "li",
                  null,
                  React.createElement(
                    "a",
                    { href: "/" },
                    "Guides"
                  )
                ),
                React.createElement(
                  "li",
                  null,
                  React.createElement(
                    "a",
                    { href: "http://struct.tv" },
                    "Chat Live"
                  )
                )
              )
            )
          );
        }
      }
    });
  
    return Navbar;
  })(React.Component);
  
  module.exports = Navbar;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */
  
  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
  
  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
  
  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
  
  var React = _interopRequire(__webpack_require__(1));
  
  var NotFoundPage = (function (_React$Component) {
    function NotFoundPage() {
      _classCallCheck(this, NotFoundPage);
  
      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }
  
    _inherits(NotFoundPage, _React$Component);
  
    _createClass(NotFoundPage, {
      render: {
        value: function render() {
          return React.createElement(
            "div",
            null,
            React.createElement(
              "h1",
              null,
              "Page Not Found"
            ),
            React.createElement(
              "p",
              null,
              "Sorry, but the page you were trying to view does not exist."
            )
          );
        }
      }
    });
  
    return NotFoundPage;
  })(React.Component);
  
  module.exports = NotFoundPage;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Copyright 2013-2015, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ExecutionEnvironment
   */
  
  /*jslint evil: true */
  
  "use strict";
  
  var canUseDOM = !!(
    (typeof window !== 'undefined' &&
    window.document && window.document.createElement)
  );
  
  /**
   * Simple, lightweight module assisting with the detection and context of
   * Worker. Helps avoid circular dependencies and allows code to reason about
   * whether or not they are in a Worker, even if they never include the main
   * `ReactWorker` dependency.
   */
  var ExecutionEnvironment = {
  
    canUseDOM: canUseDOM,
  
    canUseWorkers: typeof Worker !== 'undefined',
  
    canUseEventListeners:
      canUseDOM && !!(window.addEventListener || window.attachEvent),
  
    canUseViewport: canUseDOM && !!window.screen,
  
    isInWorker: !canUseDOM // For now, this is true - might change in the future.
  
  };
  
  module.exports = ExecutionEnvironment;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("eventemitter3");

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("express");

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("flux");

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("front-matter");

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("fs");

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("jade");

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("path");

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("superagent");

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2FjNjBmZThkMzNjMTlhOTIyZjIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdFwiIiwid2VicGFjazovLy8uL3NyYy9jb25zdGFudHMvQWN0aW9uVHlwZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnN0YW50cy9QYXlsb2FkU291cmNlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29yZS9EaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL34vcmVhY3QvbGliL09iamVjdC5hc3NpZ24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0b3Jlcy9BcHBTdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlYWN0L2xpYi9pbnZhcmlhbnQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWFjdC9saWIva2V5TWlycm9yLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImxvZGFzaFwiIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL0FwcEFjdGlvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvQXBwL0FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9Db250ZW50UGFnZS9Db250ZW50UGFnZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9Gb290ZXJiYXIvRm9vdGVyYmFyLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0d1aWRlSXRlbS9HdWlkZUl0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvR3VpZGVQYWdlL0d1aWRlUGFnZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9NYWlsY2hpbXAvTWFpbGNoaW1wLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL05hdmJhci9OYXZiYXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvTm90Rm91bmRQYWdlL05vdEZvdW5kUGFnZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlYWN0L2xpYi9FeGVjdXRpb25FbnZpcm9ubWVudC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJldmVudGVtaXR0ZXIzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZsdXhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmcm9udC1tYXR0ZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImphZGVcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic3VwZXJhZ2VudFwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSx3Qzs7Ozs7Ozs7Ozs7Ozs7O0FDOUJBLGNBQVksQ0FBQzs7OztNQUVOLENBQUMsdUNBQU0sQ0FBUTs7TUFDZixFQUFFLHVDQUFNLEVBQUk7O01BQ1osSUFBSSx1Q0FBTSxFQUFNOztNQUNoQixPQUFPLHVDQUFNLEVBQVM7O01BQ3RCLEtBQUssdUNBQU0sQ0FBTzs7TUFDbEIsVUFBVSx1Q0FBTSxDQUFtQjs7TUFDbkMsV0FBVyx1Q0FBTSxDQUF5Qjs7TUFDMUMsUUFBUSx1Q0FBTSxDQUFtQjs7QUFFeEMsTUFBSSxNQUFNLEdBQUcsT0FBTyxFQUFFLENBQUM7O0FBRXZCLFFBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBRSxDQUFDO0FBQy9DLFFBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxVQUFPLENB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LFlBQVk7YUFBWixZQUFZOzRCQUFaLFlBQVk7Ozs7Ozs7Y0FBWixZQUFZOztpQkFBWixZQUFZO0FBRS9CLFlBQU07ZUFBQSxrQkFBRztBQUNQLGlCQUNFOzs7WUFDRTs7OzthQUF1QjtZQUN2Qjs7OzthQUFrRTtXQUM5RCxDQUNOO1NBQ0g7Ozs7V0FUa0IsWUFBWTtLQUFTLEtBQUssQ0FBQyxTQUFTOzttQkFBcEMsWUFBWSxDOzs7Ozs7QUNiakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7Ozs7OztBQ3pDQSw0Qzs7Ozs7O0FDQUEsc0M7Ozs7OztBQ0FBLG1DOzs7Ozs7QUNBQSwyQzs7Ozs7O0FDQUEsaUM7Ozs7OztBQ0FBLG1DOzs7Ozs7QUNBQSxtQzs7Ozs7O0FDQUEseUMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIuL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDNhYzYwZmU4ZDMzYzE5YTkyMmYyXG4gKiovIiwiLypcbiAqIFJlYWN0LmpzIFN0YXJ0ZXIgS2l0XG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgS29uc3RhbnRpbiBUYXJrdXMgKEBrb2lzdHlhKSwgS3JpYVNvZnQgTExDLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgRGlzcGF0Y2hlciBmcm9tICcuL2NvcmUvRGlzcGF0Y2hlcic7XG5pbXBvcnQgQWN0aW9uVHlwZXMgZnJvbSAnLi9jb25zdGFudHMvQWN0aW9uVHlwZXMnO1xuaW1wb3J0IEFwcFN0b3JlIGZyb20gJy4vc3RvcmVzL0FwcFN0b3JlJztcblxudmFyIHNlcnZlciA9IGV4cHJlc3MoKTtcblxuc2VydmVyLnNldCgncG9ydCcsIChwcm9jZXNzLmVudi5QT1JUIHx8IDk5OTkpKTtcbnNlcnZlci51c2UoZXhwcmVzcy5zdGF0aWMocGF0aC5qb2luKF9fZGlybmFtZSkpKTtcblxuLy9cbi8vIFBhZ2UgQVBJXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuc2VydmVyLmdldCgnL2FwaS9wYWdlLyonLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICB2YXIgdXJsUGF0aCA9IHJlcS5wYXRoLnN1YnN0cig5KTtcbiAgdmFyIHBhZ2UgPSBBcHBTdG9yZS5nZXRQYWdlKHVybFBhdGgpO1xuICByZXMuc2VuZChwYWdlKTtcbn0pO1xuXG4vL1xuLy8gU2VydmVyLXNpZGUgcmVuZGVyaW5nXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBUaGUgdG9wLWxldmVsIFJlYWN0IGNvbXBvbmVudCArIEhUTUwgdGVtcGxhdGUgZm9yIGl0XG52YXIgQXBwID0gUmVhY3QuY3JlYXRlRmFjdG9yeShyZXF1aXJlKCcuL2NvbXBvbmVudHMvQXBwJykpO1xudmFyIHRlbXBsYXRlRmlsZSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICd0ZW1wbGF0ZXMvaW5kZXguaHRtbCcpO1xudmFyIHRlbXBsYXRlID0gXy50ZW1wbGF0ZShmcy5yZWFkRmlsZVN5bmModGVtcGxhdGVGaWxlLCAndXRmOCcpKTtcblxuc2VydmVyLmdldCgnKicsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHZhciBkYXRhID0ge2Rlc2NyaXB0aW9uOiAnJ307XG4gIHZhciBhcHAgPSBuZXcgQXBwKHtcbiAgICBwYXRoOiByZXEucGF0aCxcbiAgICBvblNldFRpdGxlOiBmdW5jdGlvbih0aXRsZSkgeyBkYXRhLnRpdGxlID0gdGl0bGU7IH0sXG4gICAgb25TZXRNZXRhOiBmdW5jdGlvbihuYW1lLCBjb250ZW50KSB7IGRhdGFbbmFtZV0gPSBjb250ZW50OyB9LFxuICAgIG9uUGFnZU5vdEZvdW5kOiBmdW5jdGlvbigpIHsgcmVzLnN0YXR1cyg0MDQpOyB9XG4gIH0pO1xuICBkYXRhLmJvZHkgPSBSZWFjdC5yZW5kZXJUb1N0cmluZyhhcHApO1xuICB2YXIgaHRtbCA9IHRlbXBsYXRlKGRhdGEpO1xuICByZXMuc2VuZChodG1sKTtcbn0pO1xuXG4vLyBMb2FkIHBhZ2VzIGZyb20gdGhlIGAvc3JjL2NvbnRlbnQvYCBmb2xkZXIgaW50byB0aGUgQXBwU3RvcmVcbihmdW5jdGlvbigpIHtcbiAgdmFyIGFzc2lnbiA9IHJlcXVpcmUoJ3JlYWN0L2xpYi9PYmplY3QuYXNzaWduJyk7XG4gIHZhciBmbSA9IHJlcXVpcmUoJ2Zyb250LW1hdHRlcicpO1xuICB2YXIgamFkZSA9IHJlcXVpcmUoJ2phZGUnKTtcbiAgdmFyIHNvdXJjZURpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuL2NvbnRlbnQnKTtcbiAgdmFyIGdldEZpbGVzID0gZnVuY3Rpb24oZGlyKSB7XG4gICAgdmFyIHBhZ2VzID0gW107XG4gICAgZnMucmVhZGRpclN5bmMoZGlyKS5mb3JFYWNoKGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgIHZhciBzdGF0ID0gZnMuc3RhdFN5bmMocGF0aC5qb2luKGRpciwgZmlsZSkpO1xuICAgICAgaWYgKHN0YXQgJiYgc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIHBhZ2VzID0gcGFnZXMuY29uY2F0KGdldEZpbGVzKGZpbGUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENvbnZlcnQgdGhlIGZpbGUgdG8gYSBQYWdlIG9iamVjdFxuICAgICAgICB2YXIgZmlsZW5hbWUgPSBwYXRoLmpvaW4oZGlyLCBmaWxlKTtcbiAgICAgICAgdmFyIHVybCA9IGZpbGVuYW1lLlxuICAgICAgICAgIHN1YnN0cihzb3VyY2VEaXIubGVuZ3RoLCBmaWxlbmFtZS5sZW5ndGggLSBzb3VyY2VEaXIubGVuZ3RoIC0gNSlcbiAgICAgICAgICAucmVwbGFjZSgnXFxcXCcsICcvJyk7XG4gICAgICAgIGlmICh1cmwuaW5kZXhPZignL2luZGV4JywgdXJsLmxlbmd0aCAtIDYpICE9PSAtMSkge1xuICAgICAgICAgIHVybCA9IHVybC5zdWJzdHIoMCwgdXJsLmxlbmd0aCAtICh1cmwubGVuZ3RoID4gNiA/IDYgOiA1KSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNvdXJjZSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKTtcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBmbShzb3VyY2UpO1xuICAgICAgICB2YXIgaHRtbCA9IGphZGUucmVuZGVyKGNvbnRlbnQuYm9keSwgbnVsbCwgJyAgJyk7XG4gICAgICAgIHZhciBwYWdlID0gYXNzaWduKHt9LCB7cGF0aDogdXJsLCBib2R5OiBodG1sfSwgY29udGVudC5hdHRyaWJ1dGVzKTtcbiAgICAgICAgRGlzcGF0Y2hlci5oYW5kbGVTZXJ2ZXJBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvblR5cGU6IEFjdGlvblR5cGVzLkxPQURfUEFHRSxcbiAgICAgICAgICBwYXRoOiB1cmwsXG4gICAgICAgICAgcGFnZTogcGFnZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcGFnZXM7XG4gIH07XG4gIHJldHVybiBnZXRGaWxlcyhzb3VyY2VEaXIpO1xufSkoKTtcblxuc2VydmVyLmxpc3RlbihzZXJ2ZXIuZ2V0KCdwb3J0JyksIGZ1bmN0aW9uKCkge1xuICBpZiAocHJvY2Vzcy5zZW5kKSB7XG4gICAgcHJvY2Vzcy5zZW5kKCdvbmxpbmUnKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZygnVGhlIHNlcnZlciBpcyBydW5uaW5nIGF0IGh0dHA6Ly9sb2NhbGhvc3Q6JyArIHNlcnZlci5nZXQoJ3BvcnQnKSk7XG4gIH1cbn0pO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvc2VydmVyLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInJlYWN0XCJcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKlxuICogUmVhY3QuanMgU3RhcnRlciBLaXRcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLb25zdGFudGluIFRhcmt1cyAoQGtvaXN0eWEpLCBLcmlhU29mdCBMTEMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGtleU1pcnJvciBmcm9tICdyZWFjdC9saWIva2V5TWlycm9yJztcblxuZXhwb3J0IGRlZmF1bHQga2V5TWlycm9yKHtcblxuICBMT0FEX0dVSURFUzogbnVsbCxcbiAgTE9BRF9HVUlERTogbnVsbCxcbiAgTE9BRF9QQUdFOiBudWxsLFxuICBMT0FEX1BBR0VfU1VDQ0VTUzogbnVsbCxcbiAgTE9BRF9QQUdFX0VSUk9SOiBudWxsLFxuICBDSEFOR0VfTE9DQVRJT046IG51bGxcblxufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9jb25zdGFudHMvQWN0aW9uVHlwZXMuanNcbiAqKi8iLCIvKlxuICogUmVhY3QuanMgU3RhcnRlciBLaXRcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLb25zdGFudGluIFRhcmt1cyAoQGtvaXN0eWEpLCBLcmlhU29mdCBMTEMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGtleU1pcnJvciBmcm9tICdyZWFjdC9saWIva2V5TWlycm9yJztcblxuZXhwb3J0IGRlZmF1bHQga2V5TWlycm9yKHtcblxuICBWSUVXX0FDVElPTjogbnVsbCxcbiAgU0VSVkVSX0FDVElPTjogbnVsbFxuXG59KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9lc2xpbnQtbG9hZGVyIS4vc3JjL2NvbnN0YW50cy9QYXlsb2FkU291cmNlcy5qc1xuICoqLyIsIi8qXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtvbnN0YW50aW4gVGFya3VzIChAa29pc3R5YSksIEtyaWFTb2Z0IExMQy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgRmx1eCBmcm9tICdmbHV4JztcbmltcG9ydCBQYXlsb2FkU291cmNlcyBmcm9tICcuLi9jb25zdGFudHMvUGF5bG9hZFNvdXJjZXMnO1xuaW1wb3J0IGFzc2lnbiBmcm9tICdyZWFjdC9saWIvT2JqZWN0LmFzc2lnbic7XG5cbi8qKlxuICogQSBzaW5nbGV0b24gdGhhdCBvcGVyYXRlcyBhcyB0aGUgY2VudHJhbCBodWIgZm9yIGFwcGxpY2F0aW9uIHVwZGF0ZXMuXG4gKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiB2aXNpdCBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9mbHV4L1xuICovXG5sZXQgRGlzcGF0Y2hlciA9IGFzc2lnbihuZXcgRmx1eC5EaXNwYXRjaGVyKCksIHtcblxuICAvKipcbiAgICogQHBhcmFtIHtvYmplY3R9IGFjdGlvbiBUaGUgZGV0YWlscyBvZiB0aGUgYWN0aW9uLCBpbmNsdWRpbmcgdGhlIGFjdGlvbidzXG4gICAqIHR5cGUgYW5kIGFkZGl0aW9uYWwgZGF0YSBjb21pbmcgZnJvbSB0aGUgc2VydmVyLlxuICAgKi9cbiAgaGFuZGxlU2VydmVyQWN0aW9uKGFjdGlvbikge1xuICAgIHZhciBwYXlsb2FkID0ge1xuICAgICAgc291cmNlOiBQYXlsb2FkU291cmNlcy5TRVJWRVJfQUNUSU9OLFxuICAgICAgYWN0aW9uOiBhY3Rpb25cbiAgICB9O1xuICAgIHRoaXMuZGlzcGF0Y2gocGF5bG9hZCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBhY3Rpb24gVGhlIGRldGFpbHMgb2YgdGhlIGFjdGlvbiwgaW5jbHVkaW5nIHRoZSBhY3Rpb24nc1xuICAgKiB0eXBlIGFuZCBhZGRpdGlvbmFsIGRhdGEgY29taW5nIGZyb20gdGhlIHZpZXcuXG4gICAqL1xuICBoYW5kbGVWaWV3QWN0aW9uKGFjdGlvbikge1xuICAgIHZhciBwYXlsb2FkID0ge1xuICAgICAgc291cmNlOiBQYXlsb2FkU291cmNlcy5WSUVXX0FDVElPTixcbiAgICAgIGFjdGlvbjogYWN0aW9uXG4gICAgfTtcbiAgICB0aGlzLmRpc3BhdGNoKHBheWxvYWQpO1xuICB9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBEaXNwYXRjaGVyO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvY29yZS9EaXNwYXRjaGVyLmpzXG4gKiovIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIE9iamVjdC5hc3NpZ25cbiAqL1xuXG4vLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LmFzc2lnblxuXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZXMpIHtcbiAgaWYgKHRhcmdldCA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiB0YXJnZXQgY2Fubm90IGJlIG51bGwgb3IgdW5kZWZpbmVkJyk7XG4gIH1cblxuICB2YXIgdG8gPSBPYmplY3QodGFyZ2V0KTtcbiAgdmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuICBmb3IgKHZhciBuZXh0SW5kZXggPSAxOyBuZXh0SW5kZXggPCBhcmd1bWVudHMubGVuZ3RoOyBuZXh0SW5kZXgrKykge1xuICAgIHZhciBuZXh0U291cmNlID0gYXJndW1lbnRzW25leHRJbmRleF07XG4gICAgaWYgKG5leHRTb3VyY2UgPT0gbnVsbCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIGZyb20gPSBPYmplY3QobmV4dFNvdXJjZSk7XG5cbiAgICAvLyBXZSBkb24ndCBjdXJyZW50bHkgc3VwcG9ydCBhY2Nlc3NvcnMgbm9yIHByb3hpZXMuIFRoZXJlZm9yZSB0aGlzXG4gICAgLy8gY29weSBjYW5ub3QgdGhyb3cuIElmIHdlIGV2ZXIgc3VwcG9ydGVkIHRoaXMgdGhlbiB3ZSBtdXN0IGhhbmRsZVxuICAgIC8vIGV4Y2VwdGlvbnMgYW5kIHNpZGUtZWZmZWN0cy4gV2UgZG9uJ3Qgc3VwcG9ydCBzeW1ib2xzIHNvIHRoZXkgd29uJ3RcbiAgICAvLyBiZSB0cmFuc2ZlcnJlZC5cblxuICAgIGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG4gICAgICAgIHRvW2tleV0gPSBmcm9tW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRvO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3JlYWN0L2xpYi9PYmplY3QuYXNzaWduLmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypcbiAqIFJlYWN0LmpzIFN0YXJ0ZXIgS2l0XG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgS29uc3RhbnRpbiBUYXJrdXMgKEBrb2lzdHlhKSwgS3JpYVNvZnQgTExDLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBEaXNwYXRjaGVyIGZyb20gJy4uL2NvcmUvRGlzcGF0Y2hlcic7XG5pbXBvcnQgQWN0aW9uVHlwZXMgZnJvbSAnLi4vY29uc3RhbnRzL0FjdGlvblR5cGVzJztcbmltcG9ydCBQYXlsb2FkU291cmNlcyBmcm9tICcuLi9jb25zdGFudHMvUGF5bG9hZFNvdXJjZXMnO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudGVtaXR0ZXIzJztcbmltcG9ydCBhc3NpZ24gZnJvbSAncmVhY3QvbGliL09iamVjdC5hc3NpZ24nO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxudmFyIENIQU5HRV9FVkVOVCA9ICdjaGFuZ2UnO1xuXG52YXIgcGFnZXMgPSB7fTtcbnZhciBndWlkZXMgPSBbXTtcblxudmFyIGxvYWRpbmcgPSBmYWxzZTtcblxuaWYgKF9fU0VSVkVSX18pIHtcbiAgcGFnZXNbJy8nXSA9IHt0aXRsZTogJ0dldHRpbmcgU3RhcnRlZCBndWlkZXMgZm9yIGV2ZXJ5IGxhbmd1YWdlIGFuZCBmcmFtZXdvcmsuIFJ1YnkgT24gUmFpbHMsIFB5dGhvbiwgRGphbmdvLCBQSFAsIEdvLCBSdXN0J307XG4gIHBhZ2VzWycvcHJpdmFjeSddID0ge3RpdGxlOiAnUHJpdmFjeSBQb2xpY3knfTtcbn1cblxudmFyIEFwcFN0b3JlID0gYXNzaWduKHt9LCBFdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgaXNMb2FkaW5nKCkge1xuICAgIHJldHVybiBsb2FkaW5nO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXRzIHBhZ2UgZGF0YSBieSB0aGUgZ2l2ZW4gVVJMIHBhdGguXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIFVSTCBwYXRoLlxuICAgKiBAcmV0dXJucyB7Kn0gUGFnZSBkYXRhLlxuICAgKi9cbiAgZ2V0UGFnZShwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGggaW4gcGFnZXMgPyBwYWdlc1twYXRoXSA6IHtcbiAgICAgIHRpdGxlOiAnUGFnZSBOb3QgRm91bmQnLFxuICAgICAgdHlwZTogJ25vdGZvdW5kJ1xuICAgIH07XG4gIH0sXG5cbiAgZ2V0R3VpZGVzKCkge1xuICAgIHJldHVybiBndWlkZXM7XG4gIH0sXG5cbiAgZ2V0R3VpZGUoc2x1Zykge1xuICAgIGNvbnNvbGUubG9nKGd1aWRlcywgc2x1ZylcbiAgICByZXR1cm4gXy5maW5kKGd1aWRlcywgZnVuY3Rpb24oZykge1xuICAgICAgcmV0dXJuIGcuc2x1ZyA9PSBzbHVnXG4gICAgfSlcbiAgfSxcblxuICAvKipcbiAgICogRW1pdHMgY2hhbmdlIGV2ZW50IHRvIGFsbCByZWdpc3RlcmVkIGV2ZW50IGxpc3RlbmVycy5cbiAgICpcbiAgICogQHJldHVybnMge0Jvb2xlYW59IEluZGljYXRpb24gaWYgd2UndmUgZW1pdHRlZCBhbiBldmVudC5cbiAgICovXG4gIGVtaXRDaGFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdChDSEFOR0VfRVZFTlQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIG5ldyBjaGFuZ2UgZXZlbnQgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKi9cbiAgb25DaGFuZ2UoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgY2hhbmdlIGV2ZW50IGxpc3RlbmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbi5cbiAgICovXG4gIG9mZihjYWxsYmFjaykge1xuICAgIHRoaXMub2ZmKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG5cbn0pO1xuXG5BcHBTdG9yZS5kaXNwYXRjaGVyVG9rZW4gPSBEaXNwYXRjaGVyLnJlZ2lzdGVyKChwYXlsb2FkKSA9PiB7XG4gIHZhciBhY3Rpb24gPSBwYXlsb2FkLmFjdGlvbjtcblxuICBzd2l0Y2ggKGFjdGlvbi5hY3Rpb25UeXBlKSB7XG5cbiAgICBjYXNlIEFjdGlvblR5cGVzLkxPQURfUEFHRTpcbiAgICAgIGlmIChhY3Rpb24uc291cmNlID09PSBQYXlsb2FkU291cmNlcy5WSUVXX0FDVElPTikge1xuICAgICAgICBsb2FkaW5nID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFhY3Rpb24uZXJyKSB7XG4gICAgICAgICAgcGFnZXNbYWN0aW9uLnBhdGhdID0gYWN0aW9uLnBhZ2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIEFwcFN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBBY3Rpb25UeXBlcy5MT0FEX0dVSURFUzpcbiAgICAgIGlmIChhY3Rpb24uc291cmNlID09PSBQYXlsb2FkU291cmNlcy5WSUVXX0FDVElPTikge1xuICAgICAgICBsb2FkaW5nID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFhY3Rpb24uZXJyKSB7XG4gICAgICAgICAgZ3VpZGVzID0gYWN0aW9uLmd1aWRlcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgQXBwU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgLy8gRG8gbm90aGluZ1xuXG4gIH1cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEFwcFN0b3JlO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvc3RvcmVzL0FwcFN0b3JlLmpzXG4gKiovIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGludmFyaWFudFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgaW52YXJpYW50ID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgaWYgKFwicHJvZHVjdGlvblwiICE9PSBwcm9jZXNzLmVudi5OT0RFX0VOVikge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICtcbiAgICAgICAgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJ1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdJbnZhcmlhbnQgVmlvbGF0aW9uOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJnc1thcmdJbmRleCsrXTsgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3JlYWN0L2xpYi9pbnZhcmlhbnQuanNcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUga2V5TWlycm9yXG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoXCIuL2ludmFyaWFudFwiKTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGFuIGVudW1lcmF0aW9uIHdpdGgga2V5cyBlcXVhbCB0byB0aGVpciB2YWx1ZS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgIHZhciBDT0xPUlMgPSBrZXlNaXJyb3Ioe2JsdWU6IG51bGwsIHJlZDogbnVsbH0pO1xuICogICB2YXIgbXlDb2xvciA9IENPTE9SUy5ibHVlO1xuICogICB2YXIgaXNDb2xvclZhbGlkID0gISFDT0xPUlNbbXlDb2xvcl07XG4gKlxuICogVGhlIGxhc3QgbGluZSBjb3VsZCBub3QgYmUgcGVyZm9ybWVkIGlmIHRoZSB2YWx1ZXMgb2YgdGhlIGdlbmVyYXRlZCBlbnVtIHdlcmVcbiAqIG5vdCBlcXVhbCB0byB0aGVpciBrZXlzLlxuICpcbiAqICAgSW5wdXQ6ICB7a2V5MTogdmFsMSwga2V5MjogdmFsMn1cbiAqICAgT3V0cHV0OiB7a2V5MToga2V5MSwga2V5Mjoga2V5Mn1cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbnZhciBrZXlNaXJyb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHJldCA9IHt9O1xuICB2YXIga2V5O1xuICAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WID8gaW52YXJpYW50KFxuICAgIG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopLFxuICAgICdrZXlNaXJyb3IoLi4uKTogQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QuJ1xuICApIDogaW52YXJpYW50KG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopKSk7XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXRba2V5XSA9IGtleTtcbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3I7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9yZWFjdC9saWIva2V5TWlycm9yLmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJsb2Rhc2hcIlxuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtvbnN0YW50aW4gVGFya3VzIChAa29pc3R5YSksIEtyaWFTb2Z0IExMQy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgRGlzcGF0Y2hlciBmcm9tICcuLi9jb3JlL0Rpc3BhdGNoZXInO1xuaW1wb3J0IEFjdGlvblR5cGVzIGZyb20gJy4uL2NvbnN0YW50cy9BY3Rpb25UeXBlcyc7XG5pbXBvcnQgUGF5bG9hZFNvdXJjZXMgZnJvbSAnLi4vY29uc3RhbnRzL1BheWxvYWRTb3VyY2VzJztcbmltcG9ydCBFeGVjdXRpb25FbnZpcm9ubWVudCBmcm9tICdyZWFjdC9saWIvRXhlY3V0aW9uRW52aXJvbm1lbnQnO1xuaW1wb3J0IGh0dHAgZnJvbSAnc3VwZXJhZ2VudCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICBuYXZpZ2F0ZVRvKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBpZiAoRXhlY3V0aW9uRW52aXJvbm1lbnQuY2FuVXNlRE9NKSB7XG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJlcGxhY2UpIHtcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LCBkb2N1bWVudC50aXRsZSwgcGF0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe30sIGRvY3VtZW50LnRpdGxlLCBwYXRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuICAgICAgYWN0aW9uVHlwZTogQWN0aW9uVHlwZXMuQ0hBTkdFX0xPQ0FUSU9OLFxuICAgICAgcGF0aFxuICAgIH0pO1xuICB9LFxuXG4gIGxpc3RHdWlkZXMoY2IpIHtcbiAgICBcbiAgICBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuICAgICAgYWN0aW9uVHlwZTogQWN0aW9uVHlwZXMuTE9BRF9HVUlERVMsXG4gICAgICBzb3VyY2U6IFBheWxvYWRTb3VyY2VzLlZJRVdfQUNUSU9OLFxuICAgICAgZ3VpZGVzOiBbXVxuICAgIH0pO1xuXG4gICAgaHR0cC5nZXQoJy9hcGkvZ3VpZGVzJylcbiAgICAgIC5hY2NlcHQoJ2FwcGxpY2F0aW9uL2pzb24nKVxuICAgICAgLmVuZCgoZXJyLCByZXMpID0+IHtcbiAgICAgICAgRGlzcGF0Y2hlci5oYW5kbGVTZXJ2ZXJBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvblR5cGU6IEFjdGlvblR5cGVzLkxPQURfR1VJREVTLFxuICAgICAgICAgIGVycixcbiAgICAgICAgICBndWlkZXM6IHJlcy5ib2R5Lmd1aWRlc1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY2IoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9lc2xpbnQtbG9hZGVyIS4vc3JjL2FjdGlvbnMvQXBwQWN0aW9ucy5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAncmVhY3QvbGliL2ludmFyaWFudCc7XG5pbXBvcnQgQXBwQWN0aW9ucyBmcm9tICcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMnO1xuaW1wb3J0IEFwcFN0b3JlIGZyb20gJy4uLy4uL3N0b3Jlcy9BcHBTdG9yZSc7XG5pbXBvcnQgTmF2YmFyIGZyb20gJy4uL05hdmJhcic7XG5pbXBvcnQgRm9vdGVyYmFyIGZyb20gJy4uL0Zvb3RlcmJhcic7XG5pbXBvcnQgQ29udGVudFBhZ2UgZnJvbSAnLi4vQ29udGVudFBhZ2UnO1xuaW1wb3J0IEd1aWRlUGFnZSBmcm9tICcuLi9HdWlkZVBhZ2UnO1xuaW1wb3J0IE5vdEZvdW5kUGFnZSBmcm9tICcuLi9Ob3RGb3VuZFBhZ2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIHRoaXMuaGFuZGxlUG9wU3RhdGUpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgdGhpcy5oYW5kbGVQb3BTdGF0ZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVDbGljayk7XG4gIH1cblxuICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGF0aCAhPT0gbmV4dFByb3BzLnBhdGg7XG4gIH1cblxuICByZW5kZXIoKSB7XG5cbiAgICB2YXIgZ3VpZGVNYXRjaCA9IHRoaXMucHJvcHMucGF0aC5tYXRjaCgvXFwvZ3VpZGVzXFwvKC4qKSQvKVxuICAgIHZhciBndWlkZVBhdGggPSBudWxsXG5cbiAgICBpZiAoZ3VpZGVNYXRjaCkge1xuICAgICAgZ3VpZGVQYXRoID0gZ3VpZGVNYXRjaFsxXVxuICAgIH1cblxuICAgIGlmIChndWlkZVBhdGgpIHtcbiAgICAgIHZhciBndWlkZSA9IEFwcFN0b3JlLmdldEd1aWRlKGd1aWRlUGF0aClcbiAgICAgIHRoaXMucHJvcHMub25TZXRUaXRsZShcIkdldHRpbmcgU3RhcnRlZCB3aXRoIFwiICsgZ3VpZGUubWV0YWRhdGEudGl0bGUpO1xuICAgICAgZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiQXBwXCI+XG4gICAgICAgICAgPE5hdmJhciAvPlxuICAgICAgICAgIDxHdWlkZVBhZ2UgY2xhc3NOYW1lPVwiY29udGFpbmVyXCIgZ3VpZGU9e2d1aWRlfSAvPlxuICAgICAgICAgIDxGb290ZXJiYXIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYWdlID0gQXBwU3RvcmUuZ2V0UGFnZSh0aGlzLnByb3BzLnBhdGgpO1xuICAgICAgaW52YXJpYW50KHBhZ2UgIT09IHVuZGVmaW5lZCwgJ0ZhaWxlZCB0byBsb2FkIHBhZ2UgY29udGVudC4nKTtcbiAgICAgIHRoaXMucHJvcHMub25TZXRUaXRsZShwYWdlLnRpdGxlKTtcbiAgICAgIGdhKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XG4gICAgICBpZiAocGFnZS50eXBlID09PSAnbm90Zm91bmQnKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25QYWdlTm90Rm91bmQoKTtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm90Rm91bmRQYWdlLCBwYWdlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGd1aWRlcyA9IEFwcFN0b3JlLmdldEd1aWRlcygpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIkFwcFwiPlxuICAgICAgICAgIDxOYXZiYXIgLz5cbiAgICAgICAgICA8Q29udGVudFBhZ2UgY2xhc3NOYW1lPVwiY29udGFpbmVyXCIgZ3VpZGVzPXtndWlkZXN9IHsuLi5wYWdlfSAvPlxuICAgICAgICAgIDxGb290ZXJiYXIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVBvcFN0YXRlKGV2ZW50KSB7XG4gICAgQXBwQWN0aW9ucy5uYXZpZ2F0ZVRvKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSwge3JlcGxhY2U6ICEhZXZlbnQuc3RhdGV9KTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmJ1dHRvbiA9PT0gMSB8fCBldmVudC5tZXRhS2V5IHx8IGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQuc2hpZnRLZXkgfHwgZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEVuc3VyZSBsaW5rXG4gICAgdmFyIGVsID0gZXZlbnQudGFyZ2V0O1xuICAgIHdoaWxlIChlbCAmJiBlbC5ub2RlTmFtZSAhPT0gJ0EnKSB7XG4gICAgICBlbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgfVxuICAgIGlmICghZWwgfHwgZWwubm9kZU5hbWUgIT09ICdBJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChlbC5nZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJykgfHwgZWwuZ2V0QXR0cmlidXRlKCdyZWwnKSA9PT0gJ2V4dGVybmFsJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEVuc3VyZSBub24taGFzaCBmb3IgdGhlIHNhbWUgcGF0aFxuICAgIHZhciBsaW5rID0gZWwuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgaWYgKGVsLnBhdGhuYW1lID09PSBsb2NhdGlvbi5wYXRobmFtZSAmJiAoZWwuaGFzaCB8fCBsaW5rID09PSAnIycpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIG1haWx0bzogaW4gdGhlIGhyZWZcbiAgICBpZiAobGluayAmJiBsaW5rLmluZGV4T2YoJ21haWx0bzonKSA+IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgdGFyZ2V0XG4gICAgaWYgKGVsLnRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFgtb3JpZ2luXG4gICAgdmFyIG9yaWdpbiA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgK1xuICAgICAgKHdpbmRvdy5sb2NhdGlvbi5wb3J0ID8gJzonICsgd2luZG93LmxvY2F0aW9uLnBvcnQgOiAnJyk7XG4gICAgaWYgKCEoZWwuaHJlZiAmJiBlbC5ocmVmLmluZGV4T2Yob3JpZ2luKSA9PT0gMCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZWJ1aWxkIHBhdGhcbiAgICB2YXIgcGF0aCA9IGVsLnBhdGhuYW1lICsgZWwuc2VhcmNoICsgKGVsLmhhc2ggfHwgJycpO1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBBcHBBY3Rpb25zLmxpc3RHdWlkZXMoKCkgPT4ge1xuICAgICAgQXBwQWN0aW9ucy5uYXZpZ2F0ZVRvKHBhdGgpO1xuICAgIH0pO1xuICB9XG5cbn1cblxuQXBwLnByb3BUeXBlcyA9IHtcbiAgcGF0aDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBvblNldFRpdGxlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvblNldE1ldGE6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uUGFnZU5vdEZvdW5kOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvY29tcG9uZW50cy9BcHAvQXBwLmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEd1aWRlSXRlbSBmcm9tICcuLi9HdWlkZUl0ZW0nO1xuaW1wb3J0IE1haWxjaGltcCBmcm9tICcuLi9NYWlsY2hpbXAnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50UGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBndWlkZXMgPSB0aGlzLnByb3BzLmd1aWRlcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgPE1haWxjaGltcCAvPlxuICAgICAgICB7Z3VpZGVzLm1hcChmdW5jdGlvbihvYmplY3QsIGkpe1xuICAgICAgICAgIHJldHVybiA8ZGl2PlxuICAgICAgICAgICAgPEd1aWRlSXRlbSBwb3N0PXtvYmplY3R9IGtleT17aX0gLz5cbiAgICAgICAgICA8L2Rpdj47XG4gICAgICAgIH0pfVxuICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2dldHRpbmctc3RhcnRlZC1tZC9zaXRlXCI+Q29udHJpYnV0ZSBhIGd1aWRlIG9uIEdpdGh1YjwvYT5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxufVxuXG5Db250ZW50UGFnZS5wcm9wVHlwZXMgPSB7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvY29tcG9uZW50cy9Db250ZW50UGFnZS9Db250ZW50UGFnZS5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9vdGVyYmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxmb290ZXI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgRm9sbG93IHVzIG9uIDxhIGhyZWY9XCJodHRwOi8vd3d3LnR3aXR0ZXIuY29tL3N0cnVjdGRvdHR2XCIgdGFyZ2V0PVwiX2JsYW5rXCI+dHdpdHRlcjwvYT5cbiAgICAgICAgICAmbmJzcDtcbiAgICAgICAgICB8XG4gICAgICAgICAgJm5ic3A7XG4gICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly93d3cua29oYWN0aXZlLmNvbVwiIHRhcmdldD1cIl9ibGFua1wiPldlYiBEZXNpZ248L2E+IGJ5IGtvaGFjdGl2ZVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZm9vdGVyPlxuICAgICk7XG4gIH1cblxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvY29tcG9uZW50cy9Gb290ZXJiYXIvRm9vdGVyYmFyLmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHdWlkZUl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgcG9zdCA9IHRoaXMucHJvcHMucG9zdDtcbiAgICB2YXIgcG9zdFVybCA9IFwiL2d1aWRlcy9cIiArIHBvc3Quc2x1ZztcbiAgICByZXR1cm4gKFxuICAgICAgPGEgaHJlZj17cG9zdFVybH0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjYXJkIGNhcmQtaG9yaXpvbnRhbCBndWlkZS1pdGVtJz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wgczEyIG00XCI+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXtwb3N0Lm1ldGFkYXRhLmltYWdlfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbCBzMTIgbThcIj5cbiAgICAgICAgICAgICAgPGgxPntwb3N0Lm1ldGFkYXRhLnRpdGxlfTwvaDE+XG4gICAgICAgICAgICAgIDxwPntwb3N0Lm1ldGFkYXRhLnN1bW1hcnl9PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9hPlxuICAgIClcbiAgfVxuXG59XG5cbkd1aWRlSXRlbS5wcm9wVHlwZXMgPSB7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvY29tcG9uZW50cy9HdWlkZUl0ZW0vR3VpZGVJdGVtLmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHdWlkZUl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgZ3VpZGUgPSB0aGlzLnByb3BzLmd1aWRlO1xuICAgIHZhciByZW5kZXJlciA9IG5ldyBtYXJrZWQuUmVuZGVyZXIoKTtcbiAgICByZW5kZXJlci5jb2RlID0gZnVuY3Rpb24gKGNvZGUsIGxhbmd1YWdlKSB7XG4gICAgICBjb2RlID0gY29kZS5yZXBsYWNlKC9bXFx1MDBBMC1cXHU5OTk5PD5cXCZdL2dpbSwgZnVuY3Rpb24oaSkge1xuICAgICAgIHJldHVybiAnJiMnK2kuY2hhckNvZGVBdCgwKSsnOyc7XG4gICAgICB9KTtcbiAgICAgIHZhciBsYW5ndWFnZUNsYXNzID0gXCJcIlxuICAgICAgaWYgKGxhbmd1YWdlKSB7XG4gICAgICAgIGxhbmd1YWdlQ2xhc3MgPSBcImxhbmd1YWdlLVwiICsgbGFuZ3VhZ2VcbiAgICAgICAgdmFyIGdyYW1tZXIgPSBQcmlzbS5sYW5ndWFnZXNbbGFuZ3VhZ2VdO1xuICAgICAgICBpZiAoZ3JhbW1lcikge1xuICAgICAgICAgIGNvZGUgPSBQcmlzbS5oaWdobGlnaHQoY29kZSwgZ3JhbW1lcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIFwiPHByZT48Y29kZSBjbGFzcz0nXCIgKyBsYW5ndWFnZUNsYXNzICsgXCInPlwiICsgY29kZSArIFwiPC9jb2RlPjwvcHJlPlwiO1xuICAgIH07XG5cblxuICAgIHZhciBjb250ZW50ID0gbWFya2VkKGd1aWRlLmNvbnRlbnQsIHtyZW5kZXJlcjogcmVuZGVyZXJ9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImd1aWRlQm9keVwiPlxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJoZWFkZXJcIj5cbiAgICAgICAgICAgIHtndWlkZS5tZXRhZGF0YS50aXRsZX1cbiAgICAgICAgICA8L2gxPlxuICAgICAgICAgIDxhIGhyZWY9e2d1aWRlLm1ldGFkYXRhLnJlcG99PkdpdGh1YiBQcm9qZWN0PC9hPlxuICAgICAgICAgIDxwIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiBjb250ZW50fX0+XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxufVxuXG5HdWlkZUl0ZW0ucHJvcFR5cGVzID0ge1xufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9lc2xpbnQtbG9hZGVyIS4vc3JjL2NvbXBvbmVudHMvR3VpZGVQYWdlL0d1aWRlUGFnZS5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG4gIHN1YnNjcmliZTogZnVuY3Rpb24oZSkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIGUucHJldmVudERlZmF1bHQoKSBcbiAgICB2YXIgZW1haWxBZGRyZXNzID0gUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLm1haWxjaGltcEVtYWlsKS52YWx1ZVxuICAgIHZhciByZSA9IC9eKFtcXHctXFwrXSsoPzpcXC5bXFx3LV0rKSopQCgoPzpbXFx3LV0rXFwuKSpcXHdbXFx3LV17MCw2Nn0pXFwuKFthLXpdezIsNn0oPzpcXC5bYS16XXsyfSk/KSQvaTtcbiAgICBpZiAocmUudGVzdChlbWFpbEFkZHJlc3MpKSB7XG4gICAgICBqUXVlcnkucG9zdChcIi9tYWlsaW5nbGlzdFwiLCB7ZW1haWw6IGVtYWlsQWRkcmVzc30pLnN1Y2Nlc3MoZnVuY3Rpb24oKSB7XG4gICAgICAgIGFsZXJ0KFwiVGhhbmsgeW91IGZvciBqb2luaW5nXCIpO1xuICAgICAgICAkLmNvb2tpZSgnaGlkZU1haWxjaGltcCcsICd5ZXMnLCB7IGV4cGlyZXM6IDM2NSB9KTsgXG4gICAgICAgIHNlbGYuZm9yY2VVcGRhdGUoKVxuICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgYWxlcnQoXCJUaGVyZSB3YXMgYSBwcm9ibGVtIHN1YnNjcmliaW5nIHlvdSB0byB0aGUgbGlzdC5cXG5cIiArIGVycm9yLnJlc3BvbnNlSlNPTi5lcnJvcilcbiAgICAgIH0pXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgYWxlcnQoXCJJbnZhbGlkIEVtYWlsIEFkZHJlc3MuXCIpXG4gICAgfVxuICB9LFxuXG4gIGRpc21pc3M6IGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAkLmNvb2tpZSgnaGlkZU1haWxjaGltcCcsICd5ZXMnLCB7IGV4cGlyZXM6IDMwIH0pO1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCQuY29va2llKCdoaWRlTWFpbGNoaW1wJykgPT0gJ3llcycpIHtcbiAgICAgIHJldHVybiAoPGRpdiAvPilcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1haWxjaGltcCBjYXJkXCI+XG4gICAgICAgICAgPGgyPlxuICAgICAgICAgICAgU3RheSB1cCB0byBkYXRlIG9uIHRoZSBsYXRlc3QgZGV2ZWxvcG1lbnQgZ3VpZGVzLlxuICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwiY29sIHMxMlwiIG9uU3VibWl0PXt0aGlzLnN1YnNjcmliZX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzMTJcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgcmVmPVwibWFpbGNoaW1wRW1haWxcIiBpZD1cImVtYWlsXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIC8+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImVtYWlsXCI+RW1haWw8L2xhYmVsPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wgczEyXCI+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuIHJlZCBsaWdodGVuLTJcIiBvbkNsaWNrPXt0aGlzLmRpc21pc3N9Pk5vIFRoYW5rczwvYT5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG4gZ3JlZW4gbGlnaHRlbi0yXCIgb25DbGljaz17dGhpcy5zdWJzY3JpYmV9PlN1YnNjcmliZTwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvY29tcG9uZW50cy9NYWlsY2hpbXAvTWFpbGNoaW1wLmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOYXZiYXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPG5hdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5hdi13cmFwcGVyXCI+XG4gICAgICAgICAgPGEgaHJlZj1cIi9cIiBjbGFzc05hbWU9XCJicmFuZC1sb2dvIGxlZnRcIj5HZXR0aW5nLVN0YXJ0ZWQ8L2E+XG4gICAgICAgICAgPGEgaHJlZj1cIiNcIiBkYXRhLWFjdGl2YXRlcz1cIm1vYmlsZS1kZW1vXCIgY2xhc3M9XCJidXR0b24tY29sbGFwc2UgcmlnaHRcIj48aSBjbGFzcz1cIm1kaS1uYXZpZ2F0aW9uLW1lbnVcIj48L2k+PC9hPlxuICAgICAgICAgIDx1bCBpZD1cIm5hdi1tb2JpbGVcIiBjbGFzc05hbWU9XCJyaWdodCBoaWRlLW9uLW1lZC1hbmQtZG93blwiPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIvXCI+R3VpZGVzPC9hPjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9zdHJ1Y3QudHZcIj5DaGF0IExpdmU8L2E+PC9saT5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJzaWRlLW5hdlwiIGlkPVwibW9iaWxlLW5hdlwiPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIvXCI+R3VpZGVzPC9hPjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9zdHJ1Y3QudHZcIj5DaGF0IExpdmU8L2E+PC9saT5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbmF2PlxuICAgICk7XG4gIH1cblxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvY29tcG9uZW50cy9OYXZiYXIvTmF2YmFyLmpzXG4gKiovIiwiLypcbiAqIFJlYWN0LmpzIFN0YXJ0ZXIgS2l0XG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgS29uc3RhbnRpbiBUYXJrdXMgKEBrb2lzdHlhKSwgS3JpYVNvZnQgTExDLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm90Rm91bmRQYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxoMT5QYWdlIE5vdCBGb3VuZDwvaDE+XG4gICAgICAgIDxwPlNvcnJ5LCBidXQgdGhlIHBhZ2UgeW91IHdlcmUgdHJ5aW5nIHRvIHZpZXcgZG9lcyBub3QgZXhpc3QuPC9wPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9jb21wb25lbnRzL05vdEZvdW5kUGFnZS9Ob3RGb3VuZFBhZ2UuanNcbiAqKi8iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgRXhlY3V0aW9uRW52aXJvbm1lbnRcbiAqL1xuXG4vKmpzbGludCBldmlsOiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgY2FuVXNlRE9NID0gISEoXG4gICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICB3aW5kb3cuZG9jdW1lbnQgJiYgd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpXG4pO1xuXG4vKipcbiAqIFNpbXBsZSwgbGlnaHR3ZWlnaHQgbW9kdWxlIGFzc2lzdGluZyB3aXRoIHRoZSBkZXRlY3Rpb24gYW5kIGNvbnRleHQgb2ZcbiAqIFdvcmtlci4gSGVscHMgYXZvaWQgY2lyY3VsYXIgZGVwZW5kZW5jaWVzIGFuZCBhbGxvd3MgY29kZSB0byByZWFzb24gYWJvdXRcbiAqIHdoZXRoZXIgb3Igbm90IHRoZXkgYXJlIGluIGEgV29ya2VyLCBldmVuIGlmIHRoZXkgbmV2ZXIgaW5jbHVkZSB0aGUgbWFpblxuICogYFJlYWN0V29ya2VyYCBkZXBlbmRlbmN5LlxuICovXG52YXIgRXhlY3V0aW9uRW52aXJvbm1lbnQgPSB7XG5cbiAgY2FuVXNlRE9NOiBjYW5Vc2VET00sXG5cbiAgY2FuVXNlV29ya2VyczogdHlwZW9mIFdvcmtlciAhPT0gJ3VuZGVmaW5lZCcsXG5cbiAgY2FuVXNlRXZlbnRMaXN0ZW5lcnM6XG4gICAgY2FuVXNlRE9NICYmICEhKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyIHx8IHdpbmRvdy5hdHRhY2hFdmVudCksXG5cbiAgY2FuVXNlVmlld3BvcnQ6IGNhblVzZURPTSAmJiAhIXdpbmRvdy5zY3JlZW4sXG5cbiAgaXNJbldvcmtlcjogIWNhblVzZURPTSAvLyBGb3Igbm93LCB0aGlzIGlzIHRydWUgLSBtaWdodCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZS5cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFeGVjdXRpb25FbnZpcm9ubWVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3JlYWN0L2xpYi9FeGVjdXRpb25FbnZpcm9ubWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDE5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJldmVudGVtaXR0ZXIzXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJldmVudGVtaXR0ZXIzXCJcbiAqKiBtb2R1bGUgaWQgPSAyMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiZXhwcmVzc1wiXG4gKiogbW9kdWxlIGlkID0gMjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZsdXhcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImZsdXhcIlxuICoqIG1vZHVsZSBpZCA9IDIyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmcm9udC1tYXR0ZXJcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImZyb250LW1hdHRlclwiXG4gKiogbW9kdWxlIGlkID0gMjNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJmc1wiXG4gKiogbW9kdWxlIGlkID0gMjRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImphZGVcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImphZGVcIlxuICoqIG1vZHVsZSBpZCA9IDI1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJwYXRoXCJcbiAqKiBtb2R1bGUgaWQgPSAyNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic3VwZXJhZ2VudFwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwic3VwZXJhZ2VudFwiXG4gKiogbW9kdWxlIGlkID0gMjdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIiwiZmlsZSI6InNlcnZlci5qcyJ9