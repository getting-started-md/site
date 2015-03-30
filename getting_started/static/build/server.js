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
  
  var _ = _interopRequire(__webpack_require__(22));
  
  var fs = _interopRequire(__webpack_require__(20));
  
  var path = _interopRequire(__webpack_require__(23));
  
  var express = _interopRequire(__webpack_require__(17));
  
  var React = _interopRequire(__webpack_require__(1));
  
  var Dispatcher = _interopRequire(__webpack_require__(4));
  
  var ActionTypes = _interopRequire(__webpack_require__(2));
  
  var AppStore = _interopRequire(__webpack_require__(7));
  
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
    var fm = __webpack_require__(19);
    var jade = __webpack_require__(21);
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
  
  var keyMirror = _interopRequire(__webpack_require__(9));
  
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
  
  var keyMirror = _interopRequire(__webpack_require__(9));
  
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
  
  var Flux = _interopRequire(__webpack_require__(18));
  
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
/* 7 */
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
  
  var EventEmitter = _interopRequire(__webpack_require__(16));
  
  var assign = _interopRequire(__webpack_require__(5));
  
  var _ = _interopRequire(__webpack_require__(22));
  
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
/* 9 */
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
  
  var invariant = __webpack_require__(8);
  
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
  
  var ExecutionEnvironment = _interopRequire(__webpack_require__(15));
  
  var http = _interopRequire(__webpack_require__(24));
  
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
  
  var invariant = _interopRequire(__webpack_require__(8));
  
  var AppActions = _interopRequire(__webpack_require__(10));
  
  var AppStore = _interopRequire(__webpack_require__(7));
  
  var Navbar = _interopRequire(__webpack_require__(13));
  
  var ContentPage = _interopRequire(__webpack_require__(12));
  
  var GuidePage = _interopRequire(__webpack_require__(25));
  
  var NotFoundPage = _interopRequire(__webpack_require__(14));
  
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
              React.createElement(GuidePage, { className: "container", guide: guide })
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
              React.createElement(ContentPage, _extends({ className: "container", guides: guides }, page))
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
  
  var GuideItem = _interopRequire(__webpack_require__(6));
  
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
/* 14 */
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
/* 15 */
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("eventemitter3");

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("express");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("flux");

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("front-matter");

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("fs");

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("jade");

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("lodash");

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("path");

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("superagent");

/***/ },
/* 25 */
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

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTdhZTY1YTI2NDQxMTBlNjQ3Y2EiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdFwiIiwid2VicGFjazovLy8uL3NyYy9jb25zdGFudHMvQWN0aW9uVHlwZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnN0YW50cy9QYXlsb2FkU291cmNlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29yZS9EaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL34vcmVhY3QvbGliL09iamVjdC5hc3NpZ24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvR3VpZGVJdGVtL0d1aWRlSXRlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RvcmVzL0FwcFN0b3JlLmpzIiwid2VicGFjazovLy8uL34vcmVhY3QvbGliL2ludmFyaWFudC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlYWN0L2xpYi9rZXlNaXJyb3IuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvQXBwQWN0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9BcHAvQXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0NvbnRlbnRQYWdlL0NvbnRlbnRQYWdlLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL05hdmJhci9OYXZiYXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvTm90Rm91bmRQYWdlL05vdEZvdW5kUGFnZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlYWN0L2xpYi9FeGVjdXRpb25FbnZpcm9ubWVudC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJldmVudGVtaXR0ZXIzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZsdXhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmcm9udC1tYXR0ZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImphZGVcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic3VwZXJhZ2VudFwiIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0d1aWRlUGFnZS9HdWlkZVBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHdDOzs7Ozs7Ozs7Ozs7Ozs7QUM5QkEsY0FBWSxDQUFDOzs7O01BRU4sQ0FBQyx1Q0FBTSxFQUFROztNQUNmLEVBQUUsdUNBQU0sRUFBSTs7TUFDWixJQUFJLHVDQUFNLEVBQU07O01BQ2hCLE9BQU8sdUNBQU0sRUFBUzs7TUFDdEIsS0FBSyx1Q0FBTSxDQUFPOztNQUNsQixVQUFVLHVDQUFNLENBQW1COztNQUNuQyxXQUFXLHVDQUFNLENBQXlCOztNQUMxQyxRQUFRLHVDQUFNLENBQW1COztBQUV4QyxNQUFJLE1BQU0sR0FBRyxPQUFPLEVBQUUsQ0FBQzs7QUFFdkIsUUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFFLENBQUM7QUFDL0MsUUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLFVBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7QUFLakQsUUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsVUFBUyxHQUFHLEVBQUUsR0FB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Ryx1QkFBdUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FDMUM7YUFDQTtXQUNGLENBQ047U0FDSDs7OztXQW5Da0IsU0FBUztLQUFTLEtBQUssQ0FBQyxTQUFTOzttQkFBakMsU0FBUzs7QUF1QzlCLFdBQVMsQ0FBQyxTQUFTLEdBQUcsRUFDckIsQyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi4vXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgOTdhZTY1YTI2NDQxMTBlNjQ3Y2FcbiAqKi8iLCIvKlxuICogUmVhY3QuanMgU3RhcnRlciBLaXRcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLb25zdGFudGluIFRhcmt1cyAoQGtvaXN0eWEpLCBLcmlhU29mdCBMTEMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBEaXNwYXRjaGVyIGZyb20gJy4vY29yZS9EaXNwYXRjaGVyJztcbmltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICcuL2NvbnN0YW50cy9BY3Rpb25UeXBlcyc7XG5pbXBvcnQgQXBwU3RvcmUgZnJvbSAnLi9zdG9yZXMvQXBwU3RvcmUnO1xuXG52YXIgc2VydmVyID0gZXhwcmVzcygpO1xuXG5zZXJ2ZXIuc2V0KCdwb3J0JywgKHByb2Nlc3MuZW52LlBPUlQgfHwgOTk5OSkpO1xuc2VydmVyLnVzZShleHByZXNzLnN0YXRpYyhwYXRoLmpvaW4oX19kaXJuYW1lKSkpO1xuXG4vL1xuLy8gUGFnZSBBUElcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5zZXJ2ZXIuZ2V0KCcvYXBpL3BhZ2UvKicsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHZhciB1cmxQYXRoID0gcmVxLnBhdGguc3Vic3RyKDkpO1xuICB2YXIgcGFnZSA9IEFwcFN0b3JlLmdldFBhZ2UodXJsUGF0aCk7XG4gIHJlcy5zZW5kKHBhZ2UpO1xufSk7XG5cbi8vXG4vLyBTZXJ2ZXItc2lkZSByZW5kZXJpbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFRoZSB0b3AtbGV2ZWwgUmVhY3QgY29tcG9uZW50ICsgSFRNTCB0ZW1wbGF0ZSBmb3IgaXRcbnZhciBBcHAgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vY29tcG9uZW50cy9BcHAnKSk7XG52YXIgdGVtcGxhdGVGaWxlID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ3RlbXBsYXRlcy9pbmRleC5odG1sJyk7XG52YXIgdGVtcGxhdGUgPSBfLnRlbXBsYXRlKGZzLnJlYWRGaWxlU3luYyh0ZW1wbGF0ZUZpbGUsICd1dGY4JykpO1xuXG5zZXJ2ZXIuZ2V0KCcqJywgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgdmFyIGRhdGEgPSB7ZGVzY3JpcHRpb246ICcnfTtcbiAgdmFyIGFwcCA9IG5ldyBBcHAoe1xuICAgIHBhdGg6IHJlcS5wYXRoLFxuICAgIG9uU2V0VGl0bGU6IGZ1bmN0aW9uKHRpdGxlKSB7IGRhdGEudGl0bGUgPSB0aXRsZTsgfSxcbiAgICBvblNldE1ldGE6IGZ1bmN0aW9uKG5hbWUsIGNvbnRlbnQpIHsgZGF0YVtuYW1lXSA9IGNvbnRlbnQ7IH0sXG4gICAgb25QYWdlTm90Rm91bmQ6IGZ1bmN0aW9uKCkgeyByZXMuc3RhdHVzKDQwNCk7IH1cbiAgfSk7XG4gIGRhdGEuYm9keSA9IFJlYWN0LnJlbmRlclRvU3RyaW5nKGFwcCk7XG4gIHZhciBodG1sID0gdGVtcGxhdGUoZGF0YSk7XG4gIHJlcy5zZW5kKGh0bWwpO1xufSk7XG5cbi8vIExvYWQgcGFnZXMgZnJvbSB0aGUgYC9zcmMvY29udGVudC9gIGZvbGRlciBpbnRvIHRoZSBBcHBTdG9yZVxuKGZ1bmN0aW9uKCkge1xuICB2YXIgYXNzaWduID0gcmVxdWlyZSgncmVhY3QvbGliL09iamVjdC5hc3NpZ24nKTtcbiAgdmFyIGZtID0gcmVxdWlyZSgnZnJvbnQtbWF0dGVyJyk7XG4gIHZhciBqYWRlID0gcmVxdWlyZSgnamFkZScpO1xuICB2YXIgc291cmNlRGlyID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4vY29udGVudCcpO1xuICB2YXIgZ2V0RmlsZXMgPSBmdW5jdGlvbihkaXIpIHtcbiAgICB2YXIgcGFnZXMgPSBbXTtcbiAgICBmcy5yZWFkZGlyU3luYyhkaXIpLmZvckVhY2goZnVuY3Rpb24oZmlsZSkge1xuICAgICAgdmFyIHN0YXQgPSBmcy5zdGF0U3luYyhwYXRoLmpvaW4oZGlyLCBmaWxlKSk7XG4gICAgICBpZiAoc3RhdCAmJiBzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgcGFnZXMgPSBwYWdlcy5jb25jYXQoZ2V0RmlsZXMoZmlsZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ29udmVydCB0aGUgZmlsZSB0byBhIFBhZ2Ugb2JqZWN0XG4gICAgICAgIHZhciBmaWxlbmFtZSA9IHBhdGguam9pbihkaXIsIGZpbGUpO1xuICAgICAgICB2YXIgdXJsID0gZmlsZW5hbWUuXG4gICAgICAgICAgc3Vic3RyKHNvdXJjZURpci5sZW5ndGgsIGZpbGVuYW1lLmxlbmd0aCAtIHNvdXJjZURpci5sZW5ndGggLSA1KVxuICAgICAgICAgIC5yZXBsYWNlKCdcXFxcJywgJy8nKTtcbiAgICAgICAgaWYgKHVybC5pbmRleE9mKCcvaW5kZXgnLCB1cmwubGVuZ3RoIC0gNikgIT09IC0xKSB7XG4gICAgICAgICAgdXJsID0gdXJsLnN1YnN0cigwLCB1cmwubGVuZ3RoIC0gKHVybC5sZW5ndGggPiA2ID8gNiA6IDUpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc291cmNlID0gZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmOCcpO1xuICAgICAgICB2YXIgY29udGVudCA9IGZtKHNvdXJjZSk7XG4gICAgICAgIHZhciBodG1sID0gamFkZS5yZW5kZXIoY29udGVudC5ib2R5LCBudWxsLCAnICAnKTtcbiAgICAgICAgdmFyIHBhZ2UgPSBhc3NpZ24oe30sIHtwYXRoOiB1cmwsIGJvZHk6IGh0bWx9LCBjb250ZW50LmF0dHJpYnV0ZXMpO1xuICAgICAgICBEaXNwYXRjaGVyLmhhbmRsZVNlcnZlckFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uVHlwZTogQWN0aW9uVHlwZXMuTE9BRF9QQUdFLFxuICAgICAgICAgIHBhdGg6IHVybCxcbiAgICAgICAgICBwYWdlOiBwYWdlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwYWdlcztcbiAgfTtcbiAgcmV0dXJuIGdldEZpbGVzKHNvdXJjZURpcik7XG59KSgpO1xuXG5zZXJ2ZXIubGlzdGVuKHNlcnZlci5nZXQoJ3BvcnQnKSwgZnVuY3Rpb24oKSB7XG4gIGlmIChwcm9jZXNzLnNlbmQpIHtcbiAgICBwcm9jZXNzLnNlbmQoJ29ubGluZScpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKCdUaGUgc2VydmVyIGlzIHJ1bm5pbmcgYXQgaHR0cDovL2xvY2FsaG9zdDonICsgc2VydmVyLmdldCgncG9ydCcpKTtcbiAgfVxufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9zZXJ2ZXIuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwicmVhY3RcIlxuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtvbnN0YW50aW4gVGFya3VzIChAa29pc3R5YSksIEtyaWFTb2Z0IExMQy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQga2V5TWlycm9yIGZyb20gJ3JlYWN0L2xpYi9rZXlNaXJyb3InO1xuXG5leHBvcnQgZGVmYXVsdCBrZXlNaXJyb3Ioe1xuXG4gIExPQURfR1VJREVTOiBudWxsLFxuICBMT0FEX0dVSURFOiBudWxsLFxuICBMT0FEX1BBR0U6IG51bGwsXG4gIExPQURfUEFHRV9TVUNDRVNTOiBudWxsLFxuICBMT0FEX1BBR0VfRVJST1I6IG51bGwsXG4gIENIQU5HRV9MT0NBVElPTjogbnVsbFxuXG59KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9lc2xpbnQtbG9hZGVyIS4vc3JjL2NvbnN0YW50cy9BY3Rpb25UeXBlcy5qc1xuICoqLyIsIi8qXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtvbnN0YW50aW4gVGFya3VzIChAa29pc3R5YSksIEtyaWFTb2Z0IExMQy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQga2V5TWlycm9yIGZyb20gJ3JlYWN0L2xpYi9rZXlNaXJyb3InO1xuXG5leHBvcnQgZGVmYXVsdCBrZXlNaXJyb3Ioe1xuXG4gIFZJRVdfQUNUSU9OOiBudWxsLFxuICBTRVJWRVJfQUNUSU9OOiBudWxsXG5cbn0pO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvY29uc3RhbnRzL1BheWxvYWRTb3VyY2VzLmpzXG4gKiovIiwiLypcbiAqIFJlYWN0LmpzIFN0YXJ0ZXIgS2l0XG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgS29uc3RhbnRpbiBUYXJrdXMgKEBrb2lzdHlhKSwgS3JpYVNvZnQgTExDLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBGbHV4IGZyb20gJ2ZsdXgnO1xuaW1wb3J0IFBheWxvYWRTb3VyY2VzIGZyb20gJy4uL2NvbnN0YW50cy9QYXlsb2FkU291cmNlcyc7XG5pbXBvcnQgYXNzaWduIGZyb20gJ3JlYWN0L2xpYi9PYmplY3QuYXNzaWduJztcblxuLyoqXG4gKiBBIHNpbmdsZXRvbiB0aGF0IG9wZXJhdGVzIGFzIHRoZSBjZW50cmFsIGh1YiBmb3IgYXBwbGljYXRpb24gdXBkYXRlcy5cbiAqIEZvciBtb3JlIGluZm9ybWF0aW9uIHZpc2l0IGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL2ZsdXgvXG4gKi9cbmxldCBEaXNwYXRjaGVyID0gYXNzaWduKG5ldyBGbHV4LkRpc3BhdGNoZXIoKSwge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge29iamVjdH0gYWN0aW9uIFRoZSBkZXRhaWxzIG9mIHRoZSBhY3Rpb24sIGluY2x1ZGluZyB0aGUgYWN0aW9uJ3NcbiAgICogdHlwZSBhbmQgYWRkaXRpb25hbCBkYXRhIGNvbWluZyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBoYW5kbGVTZXJ2ZXJBY3Rpb24oYWN0aW9uKSB7XG4gICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICBzb3VyY2U6IFBheWxvYWRTb3VyY2VzLlNFUlZFUl9BQ1RJT04sXG4gICAgICBhY3Rpb246IGFjdGlvblxuICAgIH07XG4gICAgdGhpcy5kaXNwYXRjaChwYXlsb2FkKTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtvYmplY3R9IGFjdGlvbiBUaGUgZGV0YWlscyBvZiB0aGUgYWN0aW9uLCBpbmNsdWRpbmcgdGhlIGFjdGlvbidzXG4gICAqIHR5cGUgYW5kIGFkZGl0aW9uYWwgZGF0YSBjb21pbmcgZnJvbSB0aGUgdmlldy5cbiAgICovXG4gIGhhbmRsZVZpZXdBY3Rpb24oYWN0aW9uKSB7XG4gICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICBzb3VyY2U6IFBheWxvYWRTb3VyY2VzLlZJRVdfQUNUSU9OLFxuICAgICAgYWN0aW9uOiBhY3Rpb25cbiAgICB9O1xuICAgIHRoaXMuZGlzcGF0Y2gocGF5bG9hZCk7XG4gIH1cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IERpc3BhdGNoZXI7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9jb3JlL0Rpc3BhdGNoZXIuanNcbiAqKi8iLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgT2JqZWN0LmFzc2lnblxuICovXG5cbi8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QuYXNzaWduXG5cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlcykge1xuICBpZiAodGFyZ2V0ID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIHRhcmdldCBjYW5ub3QgYmUgbnVsbCBvciB1bmRlZmluZWQnKTtcbiAgfVxuXG4gIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xuICB2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4gIGZvciAodmFyIG5leHRJbmRleCA9IDE7IG5leHRJbmRleCA8IGFyZ3VtZW50cy5sZW5ndGg7IG5leHRJbmRleCsrKSB7XG4gICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbbmV4dEluZGV4XTtcbiAgICBpZiAobmV4dFNvdXJjZSA9PSBudWxsKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgZnJvbSA9IE9iamVjdChuZXh0U291cmNlKTtcblxuICAgIC8vIFdlIGRvbid0IGN1cnJlbnRseSBzdXBwb3J0IGFjY2Vzc29ycyBub3IgcHJveGllcy4gVGhlcmVmb3JlIHRoaXNcbiAgICAvLyBjb3B5IGNhbm5vdCB0aHJvdy4gSWYgd2UgZXZlciBzdXBwb3J0ZWQgdGhpcyB0aGVuIHdlIG11c3QgaGFuZGxlXG4gICAgLy8gZXhjZXB0aW9ucyBhbmQgc2lkZS1lZmZlY3RzLiBXZSBkb24ndCBzdXBwb3J0IHN5bWJvbHMgc28gdGhleSB3b24ndFxuICAgIC8vIGJlIHRyYW5zZmVycmVkLlxuXG4gICAgZm9yICh2YXIga2V5IGluIGZyb20pIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcbiAgICAgICAgdG9ba2V5XSA9IGZyb21ba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcmVhY3QvbGliL09iamVjdC5hc3NpZ24uanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEd1aWRlSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBwb3N0ID0gdGhpcy5wcm9wcy5wb3N0O1xuICAgIHZhciBwb3N0VXJsID0gXCIvZ3VpZGVzL1wiICsgcG9zdC5zbHVnO1xuICAgIHJldHVybiAoXG4gICAgICA8YSBocmVmPXtwb3N0VXJsfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NhcmQgY2FyZC1ob3Jpem9udGFsIGd1aWRlLWl0ZW0nPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbCBzMTIgbTRcIj5cbiAgICAgICAgICAgICAgPGltZyBzcmM9e3Bvc3QubWV0YWRhdGEuaW1hZ2V9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sIHMxMiBtOFwiPlxuICAgICAgICAgICAgICA8aDE+e3Bvc3QubWV0YWRhdGEudGl0bGV9PC9oMT5cbiAgICAgICAgICAgICAgPHA+e3Bvc3QubWV0YWRhdGEuc3VtbWFyeX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2E+XG4gICAgKVxuICB9XG5cbn1cblxuR3VpZGVJdGVtLnByb3BUeXBlcyA9IHtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9jb21wb25lbnRzL0d1aWRlSXRlbS9HdWlkZUl0ZW0uanNcbiAqKi8iLCIvKlxuICogUmVhY3QuanMgU3RhcnRlciBLaXRcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLb25zdGFudGluIFRhcmt1cyAoQGtvaXN0eWEpLCBLcmlhU29mdCBMTEMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IERpc3BhdGNoZXIgZnJvbSAnLi4vY29yZS9EaXNwYXRjaGVyJztcbmltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICcuLi9jb25zdGFudHMvQWN0aW9uVHlwZXMnO1xuaW1wb3J0IFBheWxvYWRTb3VyY2VzIGZyb20gJy4uL2NvbnN0YW50cy9QYXlsb2FkU291cmNlcyc7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50ZW1pdHRlcjMnO1xuaW1wb3J0IGFzc2lnbiBmcm9tICdyZWFjdC9saWIvT2JqZWN0LmFzc2lnbic7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG52YXIgQ0hBTkdFX0VWRU5UID0gJ2NoYW5nZSc7XG5cbnZhciBwYWdlcyA9IHt9O1xudmFyIGd1aWRlcyA9IFtdO1xuXG52YXIgbG9hZGluZyA9IGZhbHNlO1xuXG5pZiAoX19TRVJWRVJfXykge1xuICBwYWdlc1snLyddID0ge3RpdGxlOiAnR2V0dGluZyBTdGFydGVkIGd1aWRlcyBmb3IgZXZlcnkgbGFuZ3VhZ2UgYW5kIGZyYW1ld29yay4gUnVieSBPbiBSYWlscywgUHl0aG9uLCBEamFuZ28sIFBIUCwgR28sIFJ1c3QnfTtcbiAgcGFnZXNbJy9wcml2YWN5J10gPSB7dGl0bGU6ICdQcml2YWN5IFBvbGljeSd9O1xufVxuXG52YXIgQXBwU3RvcmUgPSBhc3NpZ24oe30sIEV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcblxuICBpc0xvYWRpbmcoKSB7XG4gICAgcmV0dXJuIGxvYWRpbmc7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldHMgcGFnZSBkYXRhIGJ5IHRoZSBnaXZlbiBVUkwgcGF0aC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggVVJMIHBhdGguXG4gICAqIEByZXR1cm5zIHsqfSBQYWdlIGRhdGEuXG4gICAqL1xuICBnZXRQYWdlKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aCBpbiBwYWdlcyA/IHBhZ2VzW3BhdGhdIDoge1xuICAgICAgdGl0bGU6ICdQYWdlIE5vdCBGb3VuZCcsXG4gICAgICB0eXBlOiAnbm90Zm91bmQnXG4gICAgfTtcbiAgfSxcblxuICBnZXRHdWlkZXMoKSB7XG4gICAgcmV0dXJuIGd1aWRlcztcbiAgfSxcblxuICBnZXRHdWlkZShzbHVnKSB7XG4gICAgY29uc29sZS5sb2coZ3VpZGVzLCBzbHVnKVxuICAgIHJldHVybiBfLmZpbmQoZ3VpZGVzLCBmdW5jdGlvbihnKSB7XG4gICAgICByZXR1cm4gZy5zbHVnID09IHNsdWdcbiAgICB9KVxuICB9LFxuXG4gIC8qKlxuICAgKiBFbWl0cyBjaGFuZ2UgZXZlbnQgdG8gYWxsIHJlZ2lzdGVyZWQgZXZlbnQgbGlzdGVuZXJzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gSW5kaWNhdGlvbiBpZiB3ZSd2ZSBlbWl0dGVkIGFuIGV2ZW50LlxuICAgKi9cbiAgZW1pdENoYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0KENIQU5HRV9FVkVOVCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbmV3IGNoYW5nZSBldmVudCBsaXN0ZW5lci5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqL1xuICBvbkNoYW5nZShjYWxsYmFjaykge1xuICAgIHRoaXMub24oQ0hBTkdFX0VWRU5ULCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbW92ZSBjaGFuZ2UgZXZlbnQgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKi9cbiAgb2ZmKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vZmYoQ0hBTkdFX0VWRU5ULCBjYWxsYmFjayk7XG4gIH1cblxufSk7XG5cbkFwcFN0b3JlLmRpc3BhdGNoZXJUb2tlbiA9IERpc3BhdGNoZXIucmVnaXN0ZXIoKHBheWxvYWQpID0+IHtcbiAgdmFyIGFjdGlvbiA9IHBheWxvYWQuYWN0aW9uO1xuXG4gIHN3aXRjaCAoYWN0aW9uLmFjdGlvblR5cGUpIHtcblxuICAgIGNhc2UgQWN0aW9uVHlwZXMuTE9BRF9QQUdFOlxuICAgICAgaWYgKGFjdGlvbi5zb3VyY2UgPT09IFBheWxvYWRTb3VyY2VzLlZJRVdfQUNUSU9OKSB7XG4gICAgICAgIGxvYWRpbmcgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICBpZiAoIWFjdGlvbi5lcnIpIHtcbiAgICAgICAgICBwYWdlc1thY3Rpb24ucGF0aF0gPSBhY3Rpb24ucGFnZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgQXBwU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIEFjdGlvblR5cGVzLkxPQURfR1VJREVTOlxuICAgICAgaWYgKGFjdGlvbi5zb3VyY2UgPT09IFBheWxvYWRTb3VyY2VzLlZJRVdfQUNUSU9OKSB7XG4gICAgICAgIGxvYWRpbmcgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICBpZiAoIWFjdGlvbi5lcnIpIHtcbiAgICAgICAgICBndWlkZXMgPSBhY3Rpb24uZ3VpZGVzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBBcHBTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBEbyBub3RoaW5nXG5cbiAgfVxuXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwU3RvcmU7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9zdG9yZXMvQXBwU3RvcmUuanNcbiAqKi8iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgaW52YXJpYW50XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciBpbnZhcmlhbnQgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WKSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgK1xuICAgICAgICAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ0ludmFyaWFudCBWaW9sYXRpb246ICcgK1xuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7IHJldHVybiBhcmdzW2FyZ0luZGV4KytdOyB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW52YXJpYW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcmVhY3QvbGliL2ludmFyaWFudC5qc1xuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBrZXlNaXJyb3JcbiAqIEB0eXBlY2hlY2tzIHN0YXRpYy1vbmx5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZShcIi4vaW52YXJpYW50XCIpO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYW4gZW51bWVyYXRpb24gd2l0aCBrZXlzIGVxdWFsIHRvIHRoZWlyIHZhbHVlLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqICAgdmFyIENPTE9SUyA9IGtleU1pcnJvcih7Ymx1ZTogbnVsbCwgcmVkOiBudWxsfSk7XG4gKiAgIHZhciBteUNvbG9yID0gQ09MT1JTLmJsdWU7XG4gKiAgIHZhciBpc0NvbG9yVmFsaWQgPSAhIUNPTE9SU1tteUNvbG9yXTtcbiAqXG4gKiBUaGUgbGFzdCBsaW5lIGNvdWxkIG5vdCBiZSBwZXJmb3JtZWQgaWYgdGhlIHZhbHVlcyBvZiB0aGUgZ2VuZXJhdGVkIGVudW0gd2VyZVxuICogbm90IGVxdWFsIHRvIHRoZWlyIGtleXMuXG4gKlxuICogICBJbnB1dDogIHtrZXkxOiB2YWwxLCBrZXkyOiB2YWwyfVxuICogICBPdXRwdXQ6IHtrZXkxOiBrZXkxLCBrZXkyOiBrZXkyfVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xudmFyIGtleU1pcnJvciA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgcmV0ID0ge307XG4gIHZhciBrZXk7XG4gIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPyBpbnZhcmlhbnQoXG4gICAgb2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaiksXG4gICAgJ2tleU1pcnJvciguLi4pOiBBcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdC4nXG4gICkgOiBpbnZhcmlhbnQob2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaikpKTtcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHJldFtrZXldID0ga2V5O1xuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3JlYWN0L2xpYi9rZXlNaXJyb3IuanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKlxuICogUmVhY3QuanMgU3RhcnRlciBLaXRcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLb25zdGFudGluIFRhcmt1cyAoQGtvaXN0eWEpLCBLcmlhU29mdCBMTEMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IERpc3BhdGNoZXIgZnJvbSAnLi4vY29yZS9EaXNwYXRjaGVyJztcbmltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICcuLi9jb25zdGFudHMvQWN0aW9uVHlwZXMnO1xuaW1wb3J0IFBheWxvYWRTb3VyY2VzIGZyb20gJy4uL2NvbnN0YW50cy9QYXlsb2FkU291cmNlcyc7XG5pbXBvcnQgRXhlY3V0aW9uRW52aXJvbm1lbnQgZnJvbSAncmVhY3QvbGliL0V4ZWN1dGlvbkVudmlyb25tZW50JztcbmltcG9ydCBodHRwIGZyb20gJ3N1cGVyYWdlbnQnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgbmF2aWdhdGVUbyhwYXRoLCBvcHRpb25zKSB7XG4gICAgaWYgKEV4ZWN1dGlvbkVudmlyb25tZW50LmNhblVzZURPTSkge1xuICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5yZXBsYWNlKSB7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgZG9jdW1lbnQudGl0bGUsIHBhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCBkb2N1bWVudC50aXRsZSwgcGF0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcbiAgICAgIGFjdGlvblR5cGU6IEFjdGlvblR5cGVzLkNIQU5HRV9MT0NBVElPTixcbiAgICAgIHBhdGhcbiAgICB9KTtcbiAgfSxcblxuICBsaXN0R3VpZGVzKGNiKSB7XG4gICAgXG4gICAgRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcbiAgICAgIGFjdGlvblR5cGU6IEFjdGlvblR5cGVzLkxPQURfR1VJREVTLFxuICAgICAgc291cmNlOiBQYXlsb2FkU291cmNlcy5WSUVXX0FDVElPTixcbiAgICAgIGd1aWRlczogW11cbiAgICB9KTtcblxuICAgIGh0dHAuZ2V0KCcvYXBpL2d1aWRlcycpXG4gICAgICAuYWNjZXB0KCdhcHBsaWNhdGlvbi9qc29uJylcbiAgICAgIC5lbmQoKGVyciwgcmVzKSA9PiB7XG4gICAgICAgIERpc3BhdGNoZXIuaGFuZGxlU2VydmVyQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25UeXBlOiBBY3Rpb25UeXBlcy5MT0FEX0dVSURFUyxcbiAgICAgICAgICBlcnIsXG4gICAgICAgICAgZ3VpZGVzOiByZXMuYm9keS5ndWlkZXNcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjYikge1xuICAgICAgICAgIGNiKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9hY3Rpb25zL0FwcEFjdGlvbnMuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ3JlYWN0L2xpYi9pbnZhcmlhbnQnO1xuaW1wb3J0IEFwcEFjdGlvbnMgZnJvbSAnLi4vLi4vYWN0aW9ucy9BcHBBY3Rpb25zJztcbmltcG9ydCBBcHBTdG9yZSBmcm9tICcuLi8uLi9zdG9yZXMvQXBwU3RvcmUnO1xuaW1wb3J0IE5hdmJhciBmcm9tICcuLi9OYXZiYXInO1xuaW1wb3J0IENvbnRlbnRQYWdlIGZyb20gJy4uL0NvbnRlbnRQYWdlJztcbmltcG9ydCBHdWlkZVBhZ2UgZnJvbSAnLi4vR3VpZGVQYWdlJztcbmltcG9ydCBOb3RGb3VuZFBhZ2UgZnJvbSAnLi4vTm90Rm91bmRQYWdlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCB0aGlzLmhhbmRsZVBvcFN0YXRlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZUNsaWNrKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIHRoaXMuaGFuZGxlUG9wU3RhdGUpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spO1xuICB9XG5cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlKG5leHRQcm9wcykge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnBhdGggIT09IG5leHRQcm9wcy5wYXRoO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuXG4gICAgdmFyIGd1aWRlTWF0Y2ggPSB0aGlzLnByb3BzLnBhdGgubWF0Y2goL1xcL2d1aWRlc1xcLyguKikkLylcbiAgICB2YXIgZ3VpZGVQYXRoID0gbnVsbFxuXG4gICAgaWYgKGd1aWRlTWF0Y2gpIHtcbiAgICAgIGd1aWRlUGF0aCA9IGd1aWRlTWF0Y2hbMV1cbiAgICB9XG5cbiAgICBpZiAoZ3VpZGVQYXRoKSB7XG4gICAgICB2YXIgZ3VpZGUgPSBBcHBTdG9yZS5nZXRHdWlkZShndWlkZVBhdGgpXG4gICAgICB0aGlzLnByb3BzLm9uU2V0VGl0bGUoXCJHZXR0aW5nIFN0YXJ0ZWQgd2l0aCBcIiArIGd1aWRlLm1ldGFkYXRhLnRpdGxlKTtcbiAgICAgIGdhKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIkFwcFwiPlxuICAgICAgICAgIDxOYXZiYXIgLz5cbiAgICAgICAgICA8R3VpZGVQYWdlIGNsYXNzTmFtZT1cImNvbnRhaW5lclwiIGd1aWRlPXtndWlkZX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYWdlID0gQXBwU3RvcmUuZ2V0UGFnZSh0aGlzLnByb3BzLnBhdGgpO1xuICAgICAgaW52YXJpYW50KHBhZ2UgIT09IHVuZGVmaW5lZCwgJ0ZhaWxlZCB0byBsb2FkIHBhZ2UgY29udGVudC4nKTtcbiAgICAgIHRoaXMucHJvcHMub25TZXRUaXRsZShwYWdlLnRpdGxlKTtcbiAgICAgIGdhKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XG4gICAgICBpZiAocGFnZS50eXBlID09PSAnbm90Zm91bmQnKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25QYWdlTm90Rm91bmQoKTtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm90Rm91bmRQYWdlLCBwYWdlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGd1aWRlcyA9IEFwcFN0b3JlLmdldEd1aWRlcygpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIkFwcFwiPlxuICAgICAgICAgIDxOYXZiYXIgLz5cbiAgICAgICAgICA8Q29udGVudFBhZ2UgY2xhc3NOYW1lPVwiY29udGFpbmVyXCIgZ3VpZGVzPXtndWlkZXN9IHsuLi5wYWdlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlUG9wU3RhdGUoZXZlbnQpIHtcbiAgICBBcHBBY3Rpb25zLm5hdmlnYXRlVG8od2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCB7cmVwbGFjZTogISFldmVudC5zdGF0ZX0pO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuYnV0dG9uID09PSAxIHx8IGV2ZW50Lm1ldGFLZXkgfHwgZXZlbnQuY3RybEtleSB8fCBldmVudC5zaGlmdEtleSB8fCBldmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRW5zdXJlIGxpbmtcbiAgICB2YXIgZWwgPSBldmVudC50YXJnZXQ7XG4gICAgd2hpbGUgKGVsICYmIGVsLm5vZGVOYW1lICE9PSAnQScpIHtcbiAgICAgIGVsID0gZWwucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgaWYgKCFlbCB8fCBlbC5ub2RlTmFtZSAhPT0gJ0EnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVsLmdldEF0dHJpYnV0ZSgnZG93bmxvYWQnKSB8fCBlbC5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnZXh0ZXJuYWwnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRW5zdXJlIG5vbi1oYXNoIGZvciB0aGUgc2FtZSBwYXRoXG4gICAgdmFyIGxpbmsgPSBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICBpZiAoZWwucGF0aG5hbWUgPT09IGxvY2F0aW9uLnBhdGhuYW1lICYmIChlbC5oYXNoIHx8IGxpbmsgPT09ICcjJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgbWFpbHRvOiBpbiB0aGUgaHJlZlxuICAgIGlmIChsaW5rICYmIGxpbmsuaW5kZXhPZignbWFpbHRvOicpID4gLTEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayB0YXJnZXRcbiAgICBpZiAoZWwudGFyZ2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gWC1vcmlnaW5cbiAgICB2YXIgb3JpZ2luID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSArXG4gICAgICAod2luZG93LmxvY2F0aW9uLnBvcnQgPyAnOicgKyB3aW5kb3cubG9jYXRpb24ucG9ydCA6ICcnKTtcbiAgICBpZiAoIShlbC5ocmVmICYmIGVsLmhyZWYuaW5kZXhPZihvcmlnaW4pID09PSAwKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlYnVpbGQgcGF0aFxuICAgIHZhciBwYXRoID0gZWwucGF0aG5hbWUgKyBlbC5zZWFyY2ggKyAoZWwuaGFzaCB8fCAnJyk7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIEFwcEFjdGlvbnMubGlzdEd1aWRlcygoKSA9PiB7XG4gICAgICBBcHBBY3Rpb25zLm5hdmlnYXRlVG8ocGF0aCk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5BcHAucHJvcFR5cGVzID0ge1xuICBwYXRoOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG9uU2V0VGl0bGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uU2V0TWV0YTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb25QYWdlTm90Rm91bmQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9jb21wb25lbnRzL0FwcC9BcHAuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR3VpZGVJdGVtIGZyb20gJy4uL0d1aWRlSXRlbSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnRQYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGd1aWRlcyA9IHRoaXMucHJvcHMuZ3VpZGVzO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICB7Z3VpZGVzLm1hcChmdW5jdGlvbihvYmplY3QsIGkpe1xuICAgICAgICAgIHJldHVybiA8ZGl2PlxuICAgICAgICAgICAgPEd1aWRlSXRlbSBwb3N0PXtvYmplY3R9IGtleT17aX0gLz5cbiAgICAgICAgICA8L2Rpdj47XG4gICAgICAgIH0pfVxuICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2dldHRpbmctc3RhcnRlZC1tZC9zaXRlXCI+Q29udHJpYnV0ZSBhIGd1aWRlIG9uIEdpdGh1YjwvYT5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxufVxuXG5Db250ZW50UGFnZS5wcm9wVHlwZXMgPSB7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvY29tcG9uZW50cy9Db250ZW50UGFnZS9Db250ZW50UGFnZS5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmF2YmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxuYXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJuYXYtd3JhcHBlclwiPlxuICAgICAgICAgIDxhIGhyZWY9XCIvXCIgY2xhc3NOYW1lPVwiYnJhbmQtbG9nbyBsZWZ0XCI+R2V0dGluZy1TdGFydGVkPC9hPlxuICAgICAgICAgIDxhIGhyZWY9XCIjXCIgZGF0YS1hY3RpdmF0ZXM9XCJtb2JpbGUtZGVtb1wiIGNsYXNzPVwiYnV0dG9uLWNvbGxhcHNlIHJpZ2h0XCI+PGkgY2xhc3M9XCJtZGktbmF2aWdhdGlvbi1tZW51XCI+PC9pPjwvYT5cbiAgICAgICAgICA8dWwgaWQ9XCJuYXYtbW9iaWxlXCIgY2xhc3NOYW1lPVwicmlnaHQgaGlkZS1vbi1tZWQtYW5kLWRvd25cIj5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiL1wiPkd1aWRlczwvYT48L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vc3RydWN0LnR2XCI+Q2hhdCBMaXZlPC9hPjwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwic2lkZS1uYXZcIiBpZD1cIm1vYmlsZS1uYXZcIj5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiL1wiPkd1aWRlczwvYT48L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vc3RydWN0LnR2XCI+Q2hhdCBMaXZlPC9hPjwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L25hdj5cbiAgICApO1xuICB9XG5cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9lc2xpbnQtbG9hZGVyIS4vc3JjL2NvbXBvbmVudHMvTmF2YmFyL05hdmJhci5qc1xuICoqLyIsIi8qXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtvbnN0YW50aW4gVGFya3VzIChAa29pc3R5YSksIEtyaWFTb2Z0IExMQy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdEZvdW5kUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8aDE+UGFnZSBOb3QgRm91bmQ8L2gxPlxuICAgICAgICA8cD5Tb3JyeSwgYnV0IHRoZSBwYWdlIHlvdSB3ZXJlIHRyeWluZyB0byB2aWV3IGRvZXMgbm90IGV4aXN0LjwvcD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvY29tcG9uZW50cy9Ob3RGb3VuZFBhZ2UvTm90Rm91bmRQYWdlLmpzXG4gKiovIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIEV4ZWN1dGlvbkVudmlyb25tZW50XG4gKi9cblxuLypqc2xpbnQgZXZpbDogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGNhblVzZURPTSA9ICEhKFxuICAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgd2luZG93LmRvY3VtZW50ICYmIHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KVxuKTtcblxuLyoqXG4gKiBTaW1wbGUsIGxpZ2h0d2VpZ2h0IG1vZHVsZSBhc3Npc3Rpbmcgd2l0aCB0aGUgZGV0ZWN0aW9uIGFuZCBjb250ZXh0IG9mXG4gKiBXb3JrZXIuIEhlbHBzIGF2b2lkIGNpcmN1bGFyIGRlcGVuZGVuY2llcyBhbmQgYWxsb3dzIGNvZGUgdG8gcmVhc29uIGFib3V0XG4gKiB3aGV0aGVyIG9yIG5vdCB0aGV5IGFyZSBpbiBhIFdvcmtlciwgZXZlbiBpZiB0aGV5IG5ldmVyIGluY2x1ZGUgdGhlIG1haW5cbiAqIGBSZWFjdFdvcmtlcmAgZGVwZW5kZW5jeS5cbiAqL1xudmFyIEV4ZWN1dGlvbkVudmlyb25tZW50ID0ge1xuXG4gIGNhblVzZURPTTogY2FuVXNlRE9NLFxuXG4gIGNhblVzZVdvcmtlcnM6IHR5cGVvZiBXb3JrZXIgIT09ICd1bmRlZmluZWQnLFxuXG4gIGNhblVzZUV2ZW50TGlzdGVuZXJzOlxuICAgIGNhblVzZURPTSAmJiAhISh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciB8fCB3aW5kb3cuYXR0YWNoRXZlbnQpLFxuXG4gIGNhblVzZVZpZXdwb3J0OiBjYW5Vc2VET00gJiYgISF3aW5kb3cuc2NyZWVuLFxuXG4gIGlzSW5Xb3JrZXI6ICFjYW5Vc2VET00gLy8gRm9yIG5vdywgdGhpcyBpcyB0cnVlIC0gbWlnaHQgY2hhbmdlIGluIHRoZSBmdXR1cmUuXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXhlY3V0aW9uRW52aXJvbm1lbnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9yZWFjdC9saWIvRXhlY3V0aW9uRW52aXJvbm1lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAxNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXZlbnRlbWl0dGVyM1wiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiZXZlbnRlbWl0dGVyM1wiXG4gKiogbW9kdWxlIGlkID0gMTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImV4cHJlc3NcIlxuICoqIG1vZHVsZSBpZCA9IDE3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmbHV4XCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJmbHV4XCJcbiAqKiBtb2R1bGUgaWQgPSAxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnJvbnQtbWF0dGVyXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJmcm9udC1tYXR0ZXJcIlxuICoqIG1vZHVsZSBpZCA9IDE5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiZnNcIlxuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqYWRlXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJqYWRlXCJcbiAqKiBtb2R1bGUgaWQgPSAyMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJsb2Rhc2hcIlxuICoqIG1vZHVsZSBpZCA9IDIyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJwYXRoXCJcbiAqKiBtb2R1bGUgaWQgPSAyM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic3VwZXJhZ2VudFwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwic3VwZXJhZ2VudFwiXG4gKiogbW9kdWxlIGlkID0gMjRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3VpZGVJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGd1aWRlID0gdGhpcy5wcm9wcy5ndWlkZTtcbiAgICB2YXIgcmVuZGVyZXIgPSBuZXcgbWFya2VkLlJlbmRlcmVyKCk7XG4gICAgcmVuZGVyZXIuY29kZSA9IGZ1bmN0aW9uIChjb2RlLCBsYW5ndWFnZSkge1xuICAgICAgY29kZSA9IGNvZGUucmVwbGFjZSgvW1xcdTAwQTAtXFx1OTk5OTw+XFwmXS9naW0sIGZ1bmN0aW9uKGkpIHtcbiAgICAgICByZXR1cm4gJyYjJytpLmNoYXJDb2RlQXQoMCkrJzsnO1xuICAgICAgfSk7XG4gICAgICB2YXIgbGFuZ3VhZ2VDbGFzcyA9IFwiXCJcbiAgICAgIGlmIChsYW5ndWFnZSkge1xuICAgICAgICBsYW5ndWFnZUNsYXNzID0gXCJsYW5ndWFnZS1cIiArIGxhbmd1YWdlXG4gICAgICAgIHZhciBncmFtbWVyID0gUHJpc20ubGFuZ3VhZ2VzW2xhbmd1YWdlXTtcbiAgICAgICAgaWYgKGdyYW1tZXIpIHtcbiAgICAgICAgICBjb2RlID0gUHJpc20uaGlnaGxpZ2h0KGNvZGUsIGdyYW1tZXIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBcIjxwcmU+PGNvZGUgY2xhc3M9J1wiICsgbGFuZ3VhZ2VDbGFzcyArIFwiJz5cIiArIGNvZGUgKyBcIjwvY29kZT48L3ByZT5cIjtcbiAgICB9O1xuXG5cbiAgICB2YXIgY29udGVudCA9IG1hcmtlZChndWlkZS5jb250ZW50LCB7cmVuZGVyZXI6IHJlbmRlcmVyfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJndWlkZUJvZHlcIj5cbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwiaGVhZGVyXCI+XG4gICAgICAgICAgICB7Z3VpZGUubWV0YWRhdGEudGl0bGV9XG4gICAgICAgICAgPC9oMT5cbiAgICAgICAgICA8YSBocmVmPXtndWlkZS5tZXRhZGF0YS5yZXBvfT5HaXRodWIgUHJvamVjdDwvYT5cbiAgICAgICAgICA8cCBkYW5nZXJvdXNseVNldElubmVySFRNTD17e19faHRtbDogY29udGVudH19PlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbn1cblxuR3VpZGVJdGVtLnByb3BUeXBlcyA9IHtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9jb21wb25lbnRzL0d1aWRlUGFnZS9HdWlkZVBhZ2UuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiIsImZpbGUiOiJzZXJ2ZXIuanMifQ==