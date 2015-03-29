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
                  { className: "col s4" },
                  React.createElement("img", { src: "http://flask.pocoo.org/static/logo/flask.png" })
                ),
                React.createElement(
                  "div",
                  { className: "col s8" },
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
    pages["/"] = { title: "Home Page" };
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
            })
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
                "Getting-Started.md"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjQzMTgwNWJlZWRkMGQ4MDUxMDEiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdFwiIiwid2VicGFjazovLy8uL3NyYy9jb25zdGFudHMvQWN0aW9uVHlwZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnN0YW50cy9QYXlsb2FkU291cmNlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29yZS9EaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL34vcmVhY3QvbGliL09iamVjdC5hc3NpZ24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvR3VpZGVJdGVtL0d1aWRlSXRlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RvcmVzL0FwcFN0b3JlLmpzIiwid2VicGFjazovLy8uL34vcmVhY3QvbGliL2ludmFyaWFudC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlYWN0L2xpYi9rZXlNaXJyb3IuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvQXBwQWN0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9BcHAvQXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0NvbnRlbnRQYWdlL0NvbnRlbnRQYWdlLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL05hdmJhci9OYXZiYXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvTm90Rm91bmRQYWdlL05vdEZvdW5kUGFnZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlYWN0L2xpYi9FeGVjdXRpb25FbnZpcm9ubWVudC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJldmVudGVtaXR0ZXIzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZsdXhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmcm9udC1tYXR0ZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImphZGVcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic3VwZXJhZ2VudFwiIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0d1aWRlUGFnZS9HdWlkZVBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHdDOzs7Ozs7Ozs7Ozs7Ozs7QUM5QkEsY0FBWSxDQUFDOzs7O01BRU4sQ0FBQyx1Q0FBTSxFQUFROztNQUNmLEVBQUUsdUNBQU0sRUFBSTs7TUFDWixJQUFJLHVDQUFNLEVBQU07O01BQ2hCLE9BQU8sdUNBQU0sRUFBUzs7TUFDdEIsS0FBSyx1Q0FBTSxDQUFPOztNQUNsQixVQUFVLHVDQUFNLENBQW1COztNQUNuQyxXQUFXLHVDQUFNLENBQXlCOztNQUMxQyxRQUFRLHVDQUFNLENBQW1COztBQUV4QyxNQUFJLE1BQU0sR0FBRyxPQUFPLEVBQUUsQ0FBQzs7QUFFdkIsUUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFFLENBQUM7QUFDL0MsUUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLFVBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7QUFLakQsUUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsVUFBUyxHQUFHLEVBQUUsR0FB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QU8sRUFBRTtBQUNYLG9CQUFJLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO2VBQ3RDO2FBQ0Y7QUFDRCxtQkFBTyxvQkFBb0IsR0FBRyxhQUFhLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxlQUFlLENBQUM7V0FDN0UsQ0FBQzs7QUFHRixjQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDOztBQUUxRCxpQkFDRTs7Y0FBSyxTQUFTLEVBQUMsV0FBVztZQUN4Qjs7Z0JBQUssU0FBUyxFQUFDLFdBQVc7Y0FDeEI7O2tCQUFJLFNBQVMsRUFBQyxRQUFRO2dCQUNuQixLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUs7ZUFDbEI7Y0FDTCwyQkFBRyx1QkFBdUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FDMUM7YUFDQTtXQUNGLENBQ047U0FDSDs7OztXQWxDa0IsU0FBUztLQUFTLEtBQUssQ0FBQyxTQUFTOzttQkFBakMsU0FBUzs7QUFzQzlCLFdBQVMsQ0FBQyxTQUFTLEdBQUcsRUFDckIsQyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi4vXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgZjQzMTgwNWJlZWRkMGQ4MDUxMDFcbiAqKi8iLCIvKlxuICogUmVhY3QuanMgU3RhcnRlciBLaXRcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLb25zdGFudGluIFRhcmt1cyAoQGtvaXN0eWEpLCBLcmlhU29mdCBMTEMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBEaXNwYXRjaGVyIGZyb20gJy4vY29yZS9EaXNwYXRjaGVyJztcbmltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICcuL2NvbnN0YW50cy9BY3Rpb25UeXBlcyc7XG5pbXBvcnQgQXBwU3RvcmUgZnJvbSAnLi9zdG9yZXMvQXBwU3RvcmUnO1xuXG52YXIgc2VydmVyID0gZXhwcmVzcygpO1xuXG5zZXJ2ZXIuc2V0KCdwb3J0JywgKHByb2Nlc3MuZW52LlBPUlQgfHwgOTk5OSkpO1xuc2VydmVyLnVzZShleHByZXNzLnN0YXRpYyhwYXRoLmpvaW4oX19kaXJuYW1lKSkpO1xuXG4vL1xuLy8gUGFnZSBBUElcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5zZXJ2ZXIuZ2V0KCcvYXBpL3BhZ2UvKicsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHZhciB1cmxQYXRoID0gcmVxLnBhdGguc3Vic3RyKDkpO1xuICB2YXIgcGFnZSA9IEFwcFN0b3JlLmdldFBhZ2UodXJsUGF0aCk7XG4gIHJlcy5zZW5kKHBhZ2UpO1xufSk7XG5cbi8vXG4vLyBTZXJ2ZXItc2lkZSByZW5kZXJpbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFRoZSB0b3AtbGV2ZWwgUmVhY3QgY29tcG9uZW50ICsgSFRNTCB0ZW1wbGF0ZSBmb3IgaXRcbnZhciBBcHAgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vY29tcG9uZW50cy9BcHAnKSk7XG52YXIgdGVtcGxhdGVGaWxlID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ3RlbXBsYXRlcy9pbmRleC5odG1sJyk7XG52YXIgdGVtcGxhdGUgPSBfLnRlbXBsYXRlKGZzLnJlYWRGaWxlU3luYyh0ZW1wbGF0ZUZpbGUsICd1dGY4JykpO1xuXG5zZXJ2ZXIuZ2V0KCcqJywgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgdmFyIGRhdGEgPSB7ZGVzY3JpcHRpb246ICcnfTtcbiAgdmFyIGFwcCA9IG5ldyBBcHAoe1xuICAgIHBhdGg6IHJlcS5wYXRoLFxuICAgIG9uU2V0VGl0bGU6IGZ1bmN0aW9uKHRpdGxlKSB7IGRhdGEudGl0bGUgPSB0aXRsZTsgfSxcbiAgICBvblNldE1ldGE6IGZ1bmN0aW9uKG5hbWUsIGNvbnRlbnQpIHsgZGF0YVtuYW1lXSA9IGNvbnRlbnQ7IH0sXG4gICAgb25QYWdlTm90Rm91bmQ6IGZ1bmN0aW9uKCkgeyByZXMuc3RhdHVzKDQwNCk7IH1cbiAgfSk7XG4gIGRhdGEuYm9keSA9IFJlYWN0LnJlbmRlclRvU3RyaW5nKGFwcCk7XG4gIHZhciBodG1sID0gdGVtcGxhdGUoZGF0YSk7XG4gIHJlcy5zZW5kKGh0bWwpO1xufSk7XG5cbi8vIExvYWQgcGFnZXMgZnJvbSB0aGUgYC9zcmMvY29udGVudC9gIGZvbGRlciBpbnRvIHRoZSBBcHBTdG9yZVxuKGZ1bmN0aW9uKCkge1xuICB2YXIgYXNzaWduID0gcmVxdWlyZSgncmVhY3QvbGliL09iamVjdC5hc3NpZ24nKTtcbiAgdmFyIGZtID0gcmVxdWlyZSgnZnJvbnQtbWF0dGVyJyk7XG4gIHZhciBqYWRlID0gcmVxdWlyZSgnamFkZScpO1xuICB2YXIgc291cmNlRGlyID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4vY29udGVudCcpO1xuICB2YXIgZ2V0RmlsZXMgPSBmdW5jdGlvbihkaXIpIHtcbiAgICB2YXIgcGFnZXMgPSBbXTtcbiAgICBmcy5yZWFkZGlyU3luYyhkaXIpLmZvckVhY2goZnVuY3Rpb24oZmlsZSkge1xuICAgICAgdmFyIHN0YXQgPSBmcy5zdGF0U3luYyhwYXRoLmpvaW4oZGlyLCBmaWxlKSk7XG4gICAgICBpZiAoc3RhdCAmJiBzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgcGFnZXMgPSBwYWdlcy5jb25jYXQoZ2V0RmlsZXMoZmlsZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ29udmVydCB0aGUgZmlsZSB0byBhIFBhZ2Ugb2JqZWN0XG4gICAgICAgIHZhciBmaWxlbmFtZSA9IHBhdGguam9pbihkaXIsIGZpbGUpO1xuICAgICAgICB2YXIgdXJsID0gZmlsZW5hbWUuXG4gICAgICAgICAgc3Vic3RyKHNvdXJjZURpci5sZW5ndGgsIGZpbGVuYW1lLmxlbmd0aCAtIHNvdXJjZURpci5sZW5ndGggLSA1KVxuICAgICAgICAgIC5yZXBsYWNlKCdcXFxcJywgJy8nKTtcbiAgICAgICAgaWYgKHVybC5pbmRleE9mKCcvaW5kZXgnLCB1cmwubGVuZ3RoIC0gNikgIT09IC0xKSB7XG4gICAgICAgICAgdXJsID0gdXJsLnN1YnN0cigwLCB1cmwubGVuZ3RoIC0gKHVybC5sZW5ndGggPiA2ID8gNiA6IDUpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc291cmNlID0gZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmOCcpO1xuICAgICAgICB2YXIgY29udGVudCA9IGZtKHNvdXJjZSk7XG4gICAgICAgIHZhciBodG1sID0gamFkZS5yZW5kZXIoY29udGVudC5ib2R5LCBudWxsLCAnICAnKTtcbiAgICAgICAgdmFyIHBhZ2UgPSBhc3NpZ24oe30sIHtwYXRoOiB1cmwsIGJvZHk6IGh0bWx9LCBjb250ZW50LmF0dHJpYnV0ZXMpO1xuICAgICAgICBEaXNwYXRjaGVyLmhhbmRsZVNlcnZlckFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uVHlwZTogQWN0aW9uVHlwZXMuTE9BRF9QQUdFLFxuICAgICAgICAgIHBhdGg6IHVybCxcbiAgICAgICAgICBwYWdlOiBwYWdlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwYWdlcztcbiAgfTtcbiAgcmV0dXJuIGdldEZpbGVzKHNvdXJjZURpcik7XG59KSgpO1xuXG5zZXJ2ZXIubGlzdGVuKHNlcnZlci5nZXQoJ3BvcnQnKSwgZnVuY3Rpb24oKSB7XG4gIGlmIChwcm9jZXNzLnNlbmQpIHtcbiAgICBwcm9jZXNzLnNlbmQoJ29ubGluZScpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKCdUaGUgc2VydmVyIGlzIHJ1bm5pbmcgYXQgaHR0cDovL2xvY2FsaG9zdDonICsgc2VydmVyLmdldCgncG9ydCcpKTtcbiAgfVxufSk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9zZXJ2ZXIuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwicmVhY3RcIlxuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtvbnN0YW50aW4gVGFya3VzIChAa29pc3R5YSksIEtyaWFTb2Z0IExMQy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQga2V5TWlycm9yIGZyb20gJ3JlYWN0L2xpYi9rZXlNaXJyb3InO1xuXG5leHBvcnQgZGVmYXVsdCBrZXlNaXJyb3Ioe1xuXG4gIExPQURfR1VJREVTOiBudWxsLFxuICBMT0FEX0dVSURFOiBudWxsLFxuICBMT0FEX1BBR0U6IG51bGwsXG4gIExPQURfUEFHRV9TVUNDRVNTOiBudWxsLFxuICBMT0FEX1BBR0VfRVJST1I6IG51bGwsXG4gIENIQU5HRV9MT0NBVElPTjogbnVsbFxuXG59KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9lc2xpbnQtbG9hZGVyIS4vc3JjL2NvbnN0YW50cy9BY3Rpb25UeXBlcy5qc1xuICoqLyIsIi8qXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtvbnN0YW50aW4gVGFya3VzIChAa29pc3R5YSksIEtyaWFTb2Z0IExMQy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQga2V5TWlycm9yIGZyb20gJ3JlYWN0L2xpYi9rZXlNaXJyb3InO1xuXG5leHBvcnQgZGVmYXVsdCBrZXlNaXJyb3Ioe1xuXG4gIFZJRVdfQUNUSU9OOiBudWxsLFxuICBTRVJWRVJfQUNUSU9OOiBudWxsXG5cbn0pO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvY29uc3RhbnRzL1BheWxvYWRTb3VyY2VzLmpzXG4gKiovIiwiLypcbiAqIFJlYWN0LmpzIFN0YXJ0ZXIgS2l0XG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgS29uc3RhbnRpbiBUYXJrdXMgKEBrb2lzdHlhKSwgS3JpYVNvZnQgTExDLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBGbHV4IGZyb20gJ2ZsdXgnO1xuaW1wb3J0IFBheWxvYWRTb3VyY2VzIGZyb20gJy4uL2NvbnN0YW50cy9QYXlsb2FkU291cmNlcyc7XG5pbXBvcnQgYXNzaWduIGZyb20gJ3JlYWN0L2xpYi9PYmplY3QuYXNzaWduJztcblxuLyoqXG4gKiBBIHNpbmdsZXRvbiB0aGF0IG9wZXJhdGVzIGFzIHRoZSBjZW50cmFsIGh1YiBmb3IgYXBwbGljYXRpb24gdXBkYXRlcy5cbiAqIEZvciBtb3JlIGluZm9ybWF0aW9uIHZpc2l0IGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL2ZsdXgvXG4gKi9cbmxldCBEaXNwYXRjaGVyID0gYXNzaWduKG5ldyBGbHV4LkRpc3BhdGNoZXIoKSwge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge29iamVjdH0gYWN0aW9uIFRoZSBkZXRhaWxzIG9mIHRoZSBhY3Rpb24sIGluY2x1ZGluZyB0aGUgYWN0aW9uJ3NcbiAgICogdHlwZSBhbmQgYWRkaXRpb25hbCBkYXRhIGNvbWluZyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBoYW5kbGVTZXJ2ZXJBY3Rpb24oYWN0aW9uKSB7XG4gICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICBzb3VyY2U6IFBheWxvYWRTb3VyY2VzLlNFUlZFUl9BQ1RJT04sXG4gICAgICBhY3Rpb246IGFjdGlvblxuICAgIH07XG4gICAgdGhpcy5kaXNwYXRjaChwYXlsb2FkKTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtvYmplY3R9IGFjdGlvbiBUaGUgZGV0YWlscyBvZiB0aGUgYWN0aW9uLCBpbmNsdWRpbmcgdGhlIGFjdGlvbidzXG4gICAqIHR5cGUgYW5kIGFkZGl0aW9uYWwgZGF0YSBjb21pbmcgZnJvbSB0aGUgdmlldy5cbiAgICovXG4gIGhhbmRsZVZpZXdBY3Rpb24oYWN0aW9uKSB7XG4gICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICBzb3VyY2U6IFBheWxvYWRTb3VyY2VzLlZJRVdfQUNUSU9OLFxuICAgICAgYWN0aW9uOiBhY3Rpb25cbiAgICB9O1xuICAgIHRoaXMuZGlzcGF0Y2gocGF5bG9hZCk7XG4gIH1cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IERpc3BhdGNoZXI7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9jb3JlL0Rpc3BhdGNoZXIuanNcbiAqKi8iLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgT2JqZWN0LmFzc2lnblxuICovXG5cbi8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QuYXNzaWduXG5cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlcykge1xuICBpZiAodGFyZ2V0ID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIHRhcmdldCBjYW5ub3QgYmUgbnVsbCBvciB1bmRlZmluZWQnKTtcbiAgfVxuXG4gIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xuICB2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4gIGZvciAodmFyIG5leHRJbmRleCA9IDE7IG5leHRJbmRleCA8IGFyZ3VtZW50cy5sZW5ndGg7IG5leHRJbmRleCsrKSB7XG4gICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbbmV4dEluZGV4XTtcbiAgICBpZiAobmV4dFNvdXJjZSA9PSBudWxsKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgZnJvbSA9IE9iamVjdChuZXh0U291cmNlKTtcblxuICAgIC8vIFdlIGRvbid0IGN1cnJlbnRseSBzdXBwb3J0IGFjY2Vzc29ycyBub3IgcHJveGllcy4gVGhlcmVmb3JlIHRoaXNcbiAgICAvLyBjb3B5IGNhbm5vdCB0aHJvdy4gSWYgd2UgZXZlciBzdXBwb3J0ZWQgdGhpcyB0aGVuIHdlIG11c3QgaGFuZGxlXG4gICAgLy8gZXhjZXB0aW9ucyBhbmQgc2lkZS1lZmZlY3RzLiBXZSBkb24ndCBzdXBwb3J0IHN5bWJvbHMgc28gdGhleSB3b24ndFxuICAgIC8vIGJlIHRyYW5zZmVycmVkLlxuXG4gICAgZm9yICh2YXIga2V5IGluIGZyb20pIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcbiAgICAgICAgdG9ba2V5XSA9IGZyb21ba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcmVhY3QvbGliL09iamVjdC5hc3NpZ24uanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEd1aWRlSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBwb3N0ID0gdGhpcy5wcm9wcy5wb3N0O1xuICAgIHZhciBwb3N0VXJsID0gXCIvZ3VpZGVzL1wiICsgcG9zdC5zbHVnO1xuICAgIHJldHVybiAoXG4gICAgICA8YSBocmVmPXtwb3N0VXJsfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NhcmQgY2FyZC1ob3Jpem9udGFsIGd1aWRlLWl0ZW0nPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbCBzNFwiPlxuICAgICAgICAgICAgICA8aW1nIHNyYz1cImh0dHA6Ly9mbGFzay5wb2Nvby5vcmcvc3RhdGljL2xvZ28vZmxhc2sucG5nXCIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wgczhcIj5cbiAgICAgICAgICAgICAgPGgxPntwb3N0Lm1ldGFkYXRhLnRpdGxlfTwvaDE+XG4gICAgICAgICAgICAgIDxwPntwb3N0Lm1ldGFkYXRhLnN1bW1hcnl9PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9hPlxuICAgIClcbiAgfVxuXG59XG5cbkd1aWRlSXRlbS5wcm9wVHlwZXMgPSB7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvY29tcG9uZW50cy9HdWlkZUl0ZW0vR3VpZGVJdGVtLmpzXG4gKiovIiwiLypcbiAqIFJlYWN0LmpzIFN0YXJ0ZXIgS2l0XG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgS29uc3RhbnRpbiBUYXJrdXMgKEBrb2lzdHlhKSwgS3JpYVNvZnQgTExDLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBEaXNwYXRjaGVyIGZyb20gJy4uL2NvcmUvRGlzcGF0Y2hlcic7XG5pbXBvcnQgQWN0aW9uVHlwZXMgZnJvbSAnLi4vY29uc3RhbnRzL0FjdGlvblR5cGVzJztcbmltcG9ydCBQYXlsb2FkU291cmNlcyBmcm9tICcuLi9jb25zdGFudHMvUGF5bG9hZFNvdXJjZXMnO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudGVtaXR0ZXIzJztcbmltcG9ydCBhc3NpZ24gZnJvbSAncmVhY3QvbGliL09iamVjdC5hc3NpZ24nO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxudmFyIENIQU5HRV9FVkVOVCA9ICdjaGFuZ2UnO1xuXG52YXIgcGFnZXMgPSB7fTtcbnZhciBndWlkZXMgPSBbXTtcblxudmFyIGxvYWRpbmcgPSBmYWxzZTtcblxuaWYgKF9fU0VSVkVSX18pIHtcbiAgcGFnZXNbJy8nXSA9IHt0aXRsZTogJ0hvbWUgUGFnZSd9O1xuICBwYWdlc1snL3ByaXZhY3knXSA9IHt0aXRsZTogJ1ByaXZhY3kgUG9saWN5J307XG59XG5cbnZhciBBcHBTdG9yZSA9IGFzc2lnbih7fSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gIGlzTG9hZGluZygpIHtcbiAgICByZXR1cm4gbG9hZGluZztcbiAgfSxcblxuICAvKipcbiAgICogR2V0cyBwYWdlIGRhdGEgYnkgdGhlIGdpdmVuIFVSTCBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBVUkwgcGF0aC5cbiAgICogQHJldHVybnMgeyp9IFBhZ2UgZGF0YS5cbiAgICovXG4gIGdldFBhZ2UocGF0aCkge1xuICAgIHJldHVybiBwYXRoIGluIHBhZ2VzID8gcGFnZXNbcGF0aF0gOiB7XG4gICAgICB0aXRsZTogJ1BhZ2UgTm90IEZvdW5kJyxcbiAgICAgIHR5cGU6ICdub3Rmb3VuZCdcbiAgICB9O1xuICB9LFxuXG4gIGdldEd1aWRlcygpIHtcbiAgICByZXR1cm4gZ3VpZGVzO1xuICB9LFxuXG4gIGdldEd1aWRlKHNsdWcpIHtcbiAgICBjb25zb2xlLmxvZyhndWlkZXMsIHNsdWcpXG4gICAgcmV0dXJuIF8uZmluZChndWlkZXMsIGZ1bmN0aW9uKGcpIHtcbiAgICAgIHJldHVybiBnLnNsdWcgPT0gc2x1Z1xuICAgIH0pXG4gIH0sXG5cbiAgLyoqXG4gICAqIEVtaXRzIGNoYW5nZSBldmVudCB0byBhbGwgcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMuXG4gICAqXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBJbmRpY2F0aW9uIGlmIHdlJ3ZlIGVtaXR0ZWQgYW4gZXZlbnQuXG4gICAqL1xuICBlbWl0Q2hhbmdlKCkge1xuICAgIHJldHVybiB0aGlzLmVtaXQoQ0hBTkdFX0VWRU5UKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBuZXcgY2hhbmdlIGV2ZW50IGxpc3RlbmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbi5cbiAgICovXG4gIG9uQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbihDSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIGNoYW5nZSBldmVudCBsaXN0ZW5lci5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqL1xuICBvZmYoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9mZihDSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfVxuXG59KTtcblxuQXBwU3RvcmUuZGlzcGF0Y2hlclRva2VuID0gRGlzcGF0Y2hlci5yZWdpc3RlcigocGF5bG9hZCkgPT4ge1xuICB2YXIgYWN0aW9uID0gcGF5bG9hZC5hY3Rpb247XG5cbiAgc3dpdGNoIChhY3Rpb24uYWN0aW9uVHlwZSkge1xuXG4gICAgY2FzZSBBY3Rpb25UeXBlcy5MT0FEX1BBR0U6XG4gICAgICBpZiAoYWN0aW9uLnNvdXJjZSA9PT0gUGF5bG9hZFNvdXJjZXMuVklFV19BQ1RJT04pIHtcbiAgICAgICAgbG9hZGluZyA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIGlmICghYWN0aW9uLmVycikge1xuICAgICAgICAgIHBhZ2VzW2FjdGlvbi5wYXRoXSA9IGFjdGlvbi5wYWdlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBBcHBTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgQWN0aW9uVHlwZXMuTE9BRF9HVUlERVM6XG4gICAgICBpZiAoYWN0aW9uLnNvdXJjZSA9PT0gUGF5bG9hZFNvdXJjZXMuVklFV19BQ1RJT04pIHtcbiAgICAgICAgbG9hZGluZyA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIGlmICghYWN0aW9uLmVycikge1xuICAgICAgICAgIGd1aWRlcyA9IGFjdGlvbi5ndWlkZXM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIEFwcFN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIERvIG5vdGhpbmdcblxuICB9XG5cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBcHBTdG9yZTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9lc2xpbnQtbG9hZGVyIS4vc3JjL3N0b3Jlcy9BcHBTdG9yZS5qc1xuICoqLyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBpbnZhcmlhbnRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIGludmFyaWFudCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIGlmIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnSW52YXJpYW50IFZpb2xhdGlvbjogJyArXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107IH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9yZWFjdC9saWIvaW52YXJpYW50LmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGtleU1pcnJvclxuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKFwiLi9pbnZhcmlhbnRcIik7XG5cbi8qKlxuICogQ29uc3RydWN0cyBhbiBlbnVtZXJhdGlvbiB3aXRoIGtleXMgZXF1YWwgdG8gdGhlaXIgdmFsdWUuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogICB2YXIgQ09MT1JTID0ga2V5TWlycm9yKHtibHVlOiBudWxsLCByZWQ6IG51bGx9KTtcbiAqICAgdmFyIG15Q29sb3IgPSBDT0xPUlMuYmx1ZTtcbiAqICAgdmFyIGlzQ29sb3JWYWxpZCA9ICEhQ09MT1JTW215Q29sb3JdO1xuICpcbiAqIFRoZSBsYXN0IGxpbmUgY291bGQgbm90IGJlIHBlcmZvcm1lZCBpZiB0aGUgdmFsdWVzIG9mIHRoZSBnZW5lcmF0ZWQgZW51bSB3ZXJlXG4gKiBub3QgZXF1YWwgdG8gdGhlaXIga2V5cy5cbiAqXG4gKiAgIElucHV0OiAge2tleTE6IHZhbDEsIGtleTI6IHZhbDJ9XG4gKiAgIE91dHB1dDoge2tleTE6IGtleTEsIGtleTI6IGtleTJ9XG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9ialxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG52YXIga2V5TWlycm9yID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciByZXQgPSB7fTtcbiAgdmFyIGtleTtcbiAgKFwicHJvZHVjdGlvblwiICE9PSBwcm9jZXNzLmVudi5OT0RFX0VOViA/IGludmFyaWFudChcbiAgICBvYmogaW5zdGFuY2VvZiBPYmplY3QgJiYgIUFycmF5LmlzQXJyYXkob2JqKSxcbiAgICAna2V5TWlycm9yKC4uLik6IEFyZ3VtZW50IG11c3QgYmUgYW4gb2JqZWN0LidcbiAgKSA6IGludmFyaWFudChvYmogaW5zdGFuY2VvZiBPYmplY3QgJiYgIUFycmF5LmlzQXJyYXkob2JqKSkpO1xuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcmV0W2tleV0gPSBrZXk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcmVhY3QvbGliL2tleU1pcnJvci5qc1xuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtvbnN0YW50aW4gVGFya3VzIChAa29pc3R5YSksIEtyaWFTb2Z0IExMQy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgRGlzcGF0Y2hlciBmcm9tICcuLi9jb3JlL0Rpc3BhdGNoZXInO1xuaW1wb3J0IEFjdGlvblR5cGVzIGZyb20gJy4uL2NvbnN0YW50cy9BY3Rpb25UeXBlcyc7XG5pbXBvcnQgUGF5bG9hZFNvdXJjZXMgZnJvbSAnLi4vY29uc3RhbnRzL1BheWxvYWRTb3VyY2VzJztcbmltcG9ydCBFeGVjdXRpb25FbnZpcm9ubWVudCBmcm9tICdyZWFjdC9saWIvRXhlY3V0aW9uRW52aXJvbm1lbnQnO1xuaW1wb3J0IGh0dHAgZnJvbSAnc3VwZXJhZ2VudCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICBuYXZpZ2F0ZVRvKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBpZiAoRXhlY3V0aW9uRW52aXJvbm1lbnQuY2FuVXNlRE9NKSB7XG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJlcGxhY2UpIHtcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LCBkb2N1bWVudC50aXRsZSwgcGF0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe30sIGRvY3VtZW50LnRpdGxlLCBwYXRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuICAgICAgYWN0aW9uVHlwZTogQWN0aW9uVHlwZXMuQ0hBTkdFX0xPQ0FUSU9OLFxuICAgICAgcGF0aFxuICAgIH0pO1xuICB9LFxuXG4gIGxpc3RHdWlkZXMoY2IpIHtcbiAgICBcbiAgICBEaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24oe1xuICAgICAgYWN0aW9uVHlwZTogQWN0aW9uVHlwZXMuTE9BRF9HVUlERVMsXG4gICAgICBzb3VyY2U6IFBheWxvYWRTb3VyY2VzLlZJRVdfQUNUSU9OLFxuICAgICAgZ3VpZGVzOiBbXVxuICAgIH0pO1xuXG4gICAgaHR0cC5nZXQoJy9hcGkvZ3VpZGVzJylcbiAgICAgIC5hY2NlcHQoJ2FwcGxpY2F0aW9uL2pzb24nKVxuICAgICAgLmVuZCgoZXJyLCByZXMpID0+IHtcbiAgICAgICAgRGlzcGF0Y2hlci5oYW5kbGVTZXJ2ZXJBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvblR5cGU6IEFjdGlvblR5cGVzLkxPQURfR1VJREVTLFxuICAgICAgICAgIGVycixcbiAgICAgICAgICBndWlkZXM6IHJlcy5ib2R5Lmd1aWRlc1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY2IoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9lc2xpbnQtbG9hZGVyIS4vc3JjL2FjdGlvbnMvQXBwQWN0aW9ucy5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAncmVhY3QvbGliL2ludmFyaWFudCc7XG5pbXBvcnQgQXBwQWN0aW9ucyBmcm9tICcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMnO1xuaW1wb3J0IEFwcFN0b3JlIGZyb20gJy4uLy4uL3N0b3Jlcy9BcHBTdG9yZSc7XG5pbXBvcnQgTmF2YmFyIGZyb20gJy4uL05hdmJhcic7XG5pbXBvcnQgQ29udGVudFBhZ2UgZnJvbSAnLi4vQ29udGVudFBhZ2UnO1xuaW1wb3J0IEd1aWRlUGFnZSBmcm9tICcuLi9HdWlkZVBhZ2UnO1xuaW1wb3J0IE5vdEZvdW5kUGFnZSBmcm9tICcuLi9Ob3RGb3VuZFBhZ2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIHRoaXMuaGFuZGxlUG9wU3RhdGUpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgdGhpcy5oYW5kbGVQb3BTdGF0ZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVDbGljayk7XG4gIH1cblxuICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGF0aCAhPT0gbmV4dFByb3BzLnBhdGg7XG4gIH1cblxuICByZW5kZXIoKSB7XG5cbiAgICB2YXIgZ3VpZGVNYXRjaCA9IHRoaXMucHJvcHMucGF0aC5tYXRjaCgvXFwvZ3VpZGVzXFwvKC4qKSQvKVxuICAgIHZhciBndWlkZVBhdGggPSBudWxsXG5cbiAgICBpZiAoZ3VpZGVNYXRjaCkge1xuICAgICAgZ3VpZGVQYXRoID0gZ3VpZGVNYXRjaFsxXVxuICAgIH1cblxuICAgIGlmIChndWlkZVBhdGgpIHtcbiAgICAgIHZhciBndWlkZSA9IEFwcFN0b3JlLmdldEd1aWRlKGd1aWRlUGF0aClcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiQXBwXCI+XG4gICAgICAgICAgPE5hdmJhciAvPlxuICAgICAgICAgIDxHdWlkZVBhZ2UgY2xhc3NOYW1lPVwiY29udGFpbmVyXCIgZ3VpZGU9e2d1aWRlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhZ2UgPSBBcHBTdG9yZS5nZXRQYWdlKHRoaXMucHJvcHMucGF0aCk7XG4gICAgICBpbnZhcmlhbnQocGFnZSAhPT0gdW5kZWZpbmVkLCAnRmFpbGVkIHRvIGxvYWQgcGFnZSBjb250ZW50LicpO1xuICAgICAgdGhpcy5wcm9wcy5vblNldFRpdGxlKHBhZ2UudGl0bGUpO1xuXG4gICAgICBpZiAocGFnZS50eXBlID09PSAnbm90Zm91bmQnKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25QYWdlTm90Rm91bmQoKTtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm90Rm91bmRQYWdlLCBwYWdlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGd1aWRlcyA9IEFwcFN0b3JlLmdldEd1aWRlcygpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIkFwcFwiPlxuICAgICAgICAgIDxOYXZiYXIgLz5cbiAgICAgICAgICA8Q29udGVudFBhZ2UgY2xhc3NOYW1lPVwiY29udGFpbmVyXCIgZ3VpZGVzPXtndWlkZXN9IHsuLi5wYWdlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlUG9wU3RhdGUoZXZlbnQpIHtcbiAgICBBcHBBY3Rpb25zLm5hdmlnYXRlVG8od2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCB7cmVwbGFjZTogISFldmVudC5zdGF0ZX0pO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuYnV0dG9uID09PSAxIHx8IGV2ZW50Lm1ldGFLZXkgfHwgZXZlbnQuY3RybEtleSB8fCBldmVudC5zaGlmdEtleSB8fCBldmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRW5zdXJlIGxpbmtcbiAgICB2YXIgZWwgPSBldmVudC50YXJnZXQ7XG4gICAgd2hpbGUgKGVsICYmIGVsLm5vZGVOYW1lICE9PSAnQScpIHtcbiAgICAgIGVsID0gZWwucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgaWYgKCFlbCB8fCBlbC5ub2RlTmFtZSAhPT0gJ0EnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVsLmdldEF0dHJpYnV0ZSgnZG93bmxvYWQnKSB8fCBlbC5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnZXh0ZXJuYWwnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRW5zdXJlIG5vbi1oYXNoIGZvciB0aGUgc2FtZSBwYXRoXG4gICAgdmFyIGxpbmsgPSBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICBpZiAoZWwucGF0aG5hbWUgPT09IGxvY2F0aW9uLnBhdGhuYW1lICYmIChlbC5oYXNoIHx8IGxpbmsgPT09ICcjJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgbWFpbHRvOiBpbiB0aGUgaHJlZlxuICAgIGlmIChsaW5rICYmIGxpbmsuaW5kZXhPZignbWFpbHRvOicpID4gLTEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayB0YXJnZXRcbiAgICBpZiAoZWwudGFyZ2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gWC1vcmlnaW5cbiAgICB2YXIgb3JpZ2luID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSArXG4gICAgICAod2luZG93LmxvY2F0aW9uLnBvcnQgPyAnOicgKyB3aW5kb3cubG9jYXRpb24ucG9ydCA6ICcnKTtcbiAgICBpZiAoIShlbC5ocmVmICYmIGVsLmhyZWYuaW5kZXhPZihvcmlnaW4pID09PSAwKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlYnVpbGQgcGF0aFxuICAgIHZhciBwYXRoID0gZWwucGF0aG5hbWUgKyBlbC5zZWFyY2ggKyAoZWwuaGFzaCB8fCAnJyk7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIEFwcEFjdGlvbnMubGlzdEd1aWRlcygoKSA9PiB7XG4gICAgICBBcHBBY3Rpb25zLm5hdmlnYXRlVG8ocGF0aCk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5BcHAucHJvcFR5cGVzID0ge1xuICBwYXRoOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG9uU2V0VGl0bGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uU2V0TWV0YTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb25QYWdlTm90Rm91bmQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9jb21wb25lbnRzL0FwcC9BcHAuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR3VpZGVJdGVtIGZyb20gJy4uL0d1aWRlSXRlbSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnRQYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGd1aWRlcyA9IHRoaXMucHJvcHMuZ3VpZGVzO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICB7Z3VpZGVzLm1hcChmdW5jdGlvbihvYmplY3QsIGkpe1xuICAgICAgICAgIHJldHVybiA8ZGl2PlxuICAgICAgICAgICAgPEd1aWRlSXRlbSBwb3N0PXtvYmplY3R9IGtleT17aX0gLz5cbiAgICAgICAgICA8L2Rpdj47XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG59XG5cbkNvbnRlbnRQYWdlLnByb3BUeXBlcyA9IHtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9jb21wb25lbnRzL0NvbnRlbnRQYWdlL0NvbnRlbnRQYWdlLmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOYXZiYXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPG5hdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5hdi13cmFwcGVyXCI+XG4gICAgICAgICAgPGEgaHJlZj1cIi9cIiBjbGFzc05hbWU9XCJicmFuZC1sb2dvIGxlZnRcIj5HZXR0aW5nLVN0YXJ0ZWQubWQ8L2E+XG4gICAgICAgICAgPHVsIGlkPVwibmF2LW1vYmlsZVwiIGNsYXNzTmFtZT1cInJpZ2h0IGhpZGUtb24tbWVkLWFuZC1kb3duXCI+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIi9cIj5HdWlkZXM8L2E+PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL3N0cnVjdC50dlwiPkNoYXQgTGl2ZTwvYT48L2xpPlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9uYXY+XG4gICAgKTtcbiAgfVxuXG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9jb21wb25lbnRzL05hdmJhci9OYXZiYXIuanNcbiAqKi8iLCIvKlxuICogUmVhY3QuanMgU3RhcnRlciBLaXRcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLb25zdGFudGluIFRhcmt1cyAoQGtvaXN0eWEpLCBLcmlhU29mdCBMTEMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3RGb3VuZFBhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGgxPlBhZ2UgTm90IEZvdW5kPC9oMT5cbiAgICAgICAgPHA+U29ycnksIGJ1dCB0aGUgcGFnZSB5b3Ugd2VyZSB0cnlpbmcgdG8gdmlldyBkb2VzIG5vdCBleGlzdC48L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9lc2xpbnQtbG9hZGVyIS4vc3JjL2NvbXBvbmVudHMvTm90Rm91bmRQYWdlL05vdEZvdW5kUGFnZS5qc1xuICoqLyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBFeGVjdXRpb25FbnZpcm9ubWVudFxuICovXG5cbi8qanNsaW50IGV2aWw6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjYW5Vc2VET00gPSAhIShcbiAgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gIHdpbmRvdy5kb2N1bWVudCAmJiB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudClcbik7XG5cbi8qKlxuICogU2ltcGxlLCBsaWdodHdlaWdodCBtb2R1bGUgYXNzaXN0aW5nIHdpdGggdGhlIGRldGVjdGlvbiBhbmQgY29udGV4dCBvZlxuICogV29ya2VyLiBIZWxwcyBhdm9pZCBjaXJjdWxhciBkZXBlbmRlbmNpZXMgYW5kIGFsbG93cyBjb2RlIHRvIHJlYXNvbiBhYm91dFxuICogd2hldGhlciBvciBub3QgdGhleSBhcmUgaW4gYSBXb3JrZXIsIGV2ZW4gaWYgdGhleSBuZXZlciBpbmNsdWRlIHRoZSBtYWluXG4gKiBgUmVhY3RXb3JrZXJgIGRlcGVuZGVuY3kuXG4gKi9cbnZhciBFeGVjdXRpb25FbnZpcm9ubWVudCA9IHtcblxuICBjYW5Vc2VET006IGNhblVzZURPTSxcblxuICBjYW5Vc2VXb3JrZXJzOiB0eXBlb2YgV29ya2VyICE9PSAndW5kZWZpbmVkJyxcblxuICBjYW5Vc2VFdmVudExpc3RlbmVyczpcbiAgICBjYW5Vc2VET00gJiYgISEod2luZG93LmFkZEV2ZW50TGlzdGVuZXIgfHwgd2luZG93LmF0dGFjaEV2ZW50KSxcblxuICBjYW5Vc2VWaWV3cG9ydDogY2FuVXNlRE9NICYmICEhd2luZG93LnNjcmVlbixcblxuICBpc0luV29ya2VyOiAhY2FuVXNlRE9NIC8vIEZvciBub3csIHRoaXMgaXMgdHJ1ZSAtIG1pZ2h0IGNoYW5nZSBpbiB0aGUgZnV0dXJlLlxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV4ZWN1dGlvbkVudmlyb25tZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcmVhY3QvbGliL0V4ZWN1dGlvbkVudmlyb25tZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV2ZW50ZW1pdHRlcjNcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImV2ZW50ZW1pdHRlcjNcIlxuICoqIG1vZHVsZSBpZCA9IDE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJleHByZXNzXCJcbiAqKiBtb2R1bGUgaWQgPSAxN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZmx1eFwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiZmx1eFwiXG4gKiogbW9kdWxlIGlkID0gMThcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZyb250LW1hdHRlclwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiZnJvbnQtbWF0dGVyXCJcbiAqKiBtb2R1bGUgaWQgPSAxOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImZzXCJcbiAqKiBtb2R1bGUgaWQgPSAyMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiamFkZVwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiamFkZVwiXG4gKiogbW9kdWxlIGlkID0gMjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImxvZGFzaFwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwibG9kYXNoXCJcbiAqKiBtb2R1bGUgaWQgPSAyMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwicGF0aFwiXG4gKiogbW9kdWxlIGlkID0gMjNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInN1cGVyYWdlbnRcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInN1cGVyYWdlbnRcIlxuICoqIG1vZHVsZSBpZCA9IDI0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEd1aWRlSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBndWlkZSA9IHRoaXMucHJvcHMuZ3VpZGU7XG4gICAgdmFyIHJlbmRlcmVyID0gbmV3IG1hcmtlZC5SZW5kZXJlcigpO1xuICAgIHJlbmRlcmVyLmNvZGUgPSBmdW5jdGlvbiAoY29kZSwgbGFuZ3VhZ2UpIHtcbiAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoL1tcXHUwMEEwLVxcdTk5OTk8PlxcJl0vZ2ltLCBmdW5jdGlvbihpKSB7XG4gICAgICAgcmV0dXJuICcmIycraS5jaGFyQ29kZUF0KDApKyc7JztcbiAgICAgIH0pO1xuICAgICAgdmFyIGxhbmd1YWdlQ2xhc3MgPSBcIlwiXG4gICAgICBpZiAobGFuZ3VhZ2UpIHtcbiAgICAgICAgbGFuZ3VhZ2VDbGFzcyA9IFwibGFuZ3VhZ2UtXCIgKyBsYW5ndWFnZVxuICAgICAgICB2YXIgZ3JhbW1lciA9IFByaXNtLmxhbmd1YWdlc1tsYW5ndWFnZV07XG4gICAgICAgIGlmIChncmFtbWVyKSB7XG4gICAgICAgICAgY29kZSA9IFByaXNtLmhpZ2hsaWdodChjb2RlLCBncmFtbWVyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gXCI8cHJlPjxjb2RlIGNsYXNzPSdcIiArIGxhbmd1YWdlQ2xhc3MgKyBcIic+XCIgKyBjb2RlICsgXCI8L2NvZGU+PC9wcmU+XCI7XG4gICAgfTtcblxuXG4gICAgdmFyIGNvbnRlbnQgPSBtYXJrZWQoZ3VpZGUuY29udGVudCwge3JlbmRlcmVyOiByZW5kZXJlcn0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3VpZGVCb2R5XCI+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImhlYWRlclwiPlxuICAgICAgICAgICAge2d1aWRlLm1ldGFkYXRhLnRpdGxlfVxuICAgICAgICAgIDwvaDE+XG4gICAgICAgICAgPHAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tfX2h0bWw6IGNvbnRlbnR9fT5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG59XG5cbkd1aWRlSXRlbS5wcm9wVHlwZXMgPSB7XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvY29tcG9uZW50cy9HdWlkZVBhZ2UvR3VpZGVQYWdlLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIiLCJmaWxlIjoic2VydmVyLmpzIn0=