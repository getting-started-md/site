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
  
    LOAD_POSTS: null,
    LOAD_POST: null,
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
  
          var content = marked(post.content, { renderer: renderer });
  
          return React.createElement(
            "div",
            { className: "guideBody" },
            React.createElement(
              "h1",
              { className: "header" },
              post.metadata.title
            ),
            React.createElement("p", { dangerouslySetInnerHTML: { __html: content } })
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
  
  var CHANGE_EVENT = "change";
  
  var pages = {};
  var posts = [];
  
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
  
    getPosts: function getPosts() {
      return posts;
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
  
      case ActionTypes.LOAD_POSTS:
        console.log(action);
        if (action.source === PayloadSources.VIEW_ACTION) {
          loading = true;
        } else {
          loading = false;
          if (!action.err) {
            posts = action.posts;
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
  
    listPosts: function listPosts(cb) {
  
      Dispatcher.handleViewAction({
        actionType: ActionTypes.LOAD_POSTS,
        source: PayloadSources.VIEW_ACTION,
        posts: []
      });
  
      http.get("/api/posts").accept("application/json").end(function (err, res) {
        Dispatcher.handleServerAction({
          actionType: ActionTypes.LOAD_POSTS,
          err: err,
          posts: res.body.posts
        });
        if (cb) {
          cb();
        }
      });
    },
  
    loadPage: function loadPage(path, cb) {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.LOAD_PAGE,
        path: path
      });
  
      http.get("/api/page" + path).accept("application/json").end(function (err, res) {
        Dispatcher.handleServerAction({
          actionType: ActionTypes.LOAD_PAGE,
          path: path,
          err: err,
          page: res.body
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
  
  var GuideItem = _interopRequire(__webpack_require__(6));
  
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
          var page = AppStore.getPage(this.props.path);
          invariant(page !== undefined, "Failed to load page content.");
          this.props.onSetTitle(page.title);
  
          if (page.type === "notfound") {
            this.props.onPageNotFound();
            return React.createElement(NotFoundPage, page);
          }
  
          var posts = AppStore.getPosts();
  
          return React.createElement(
            "div",
            { className: "App" },
            React.createElement(Navbar, null),
            React.createElement(ContentPage, _extends({ className: "container", posts: posts }, page))
          );
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
  
          // Ignore if tag has
          // 1. "download" attribute
          // 2. rel="external" attribute
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
          AppActions.listPosts(function () {
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
          var posts = this.props.posts;
          return React.createElement(
            "div",
            { className: "container" },
            posts.map(function (object, i) {
              return React.createElement(
                "div",
                null,
                React.createElement(GuideItem, { post: object, key: i }),
                React.createElement("div", { className: "divider" })
              );
            })
          );
        }
      }
    });
  
    return ContentPage;
  })(React.Component);
  
  module.exports = ContentPage;
  
  ContentPage.propTypes = {
    body: React.PropTypes.string.isRequired
  };

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
                { href: "#", className: "brand-logo left" },
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
                    { href: "/guides" },
                    "Guides"
                  )
                ),
                React.createElement(
                  "li",
                  null,
                  React.createElement(
                    "a",
                    { href: "/videos" },
                    "Videos"
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

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNGYwNzY4NjNmZDBmYWE4OTdjMDUiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdFwiIiwid2VicGFjazovLy8uL3NyYy9jb25zdGFudHMvQWN0aW9uVHlwZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnN0YW50cy9QYXlsb2FkU291cmNlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29yZS9EaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL34vcmVhY3QvbGliL09iamVjdC5hc3NpZ24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvR3VpZGVJdGVtL0d1aWRlSXRlbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RvcmVzL0FwcFN0b3JlLmpzIiwid2VicGFjazovLy8uL34vcmVhY3QvbGliL2ludmFyaWFudC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlYWN0L2xpYi9rZXlNaXJyb3IuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvQXBwQWN0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9BcHAvQXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL0NvbnRlbnRQYWdlL0NvbnRlbnRQYWdlLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL05hdmJhci9OYXZiYXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvTm90Rm91bmRQYWdlL05vdEZvdW5kUGFnZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlYWN0L2xpYi9FeGVjdXRpb25FbnZpcm9ubWVudC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJldmVudGVtaXR0ZXIzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZsdXhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmcm9udC1tYXR0ZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImphZGVcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic3VwZXJhZ2VudFwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSx3Qzs7Ozs7Ozs7Ozs7Ozs7O0FDOUJBLGNBQVksQ0FBQzs7OztNQUVOLENBQUMsdUNBQU0sRUFBUTs7TUFDZixFQUFFLHVDQUFNLEVBQUk7O01BQ1osSUFBSSx1Q0FBTSxFQUFNOztNQUNoQixPQUFPLHVDQUFNLEVBQVM7O01BQ3RCLEtBQUssdUNBQU0sQ0FBTzs7TUFDbEIsVUFBVSx1Q0FBTSxDQUFtQjs7TUFDbkMsV0FBVyx1Q0FBTSxDQUF5Qjs7TUFDMUMsUUFBUSx1Q0FBTSxDQUFtQjs7QUFFeEMsTUFBSSxNQUFNLEdBQUcsT0FBTyxFQUFFLENBQUM7O0FBRXZCLFFBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBRSxDQUFDO0FBQy9DLFFBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxVQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7O0FBS2pELFFBQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFVBQVMsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUMzQyxRQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0s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a0JBQUk7O3NCQUFHLElBQUksRUFBQyxTQUFTOzttQkFBVztpQkFBSztnQkFDckM7OztrQkFBSTs7c0JBQUcsSUFBSSxFQUFDLFNBQVM7O21CQUFXO2lCQUFLO2dCQUNyQzs7O2tCQUFJOztzQkFBRyxJQUFJLEVBQUMsa0JBQWtCOzttQkFBYztpQkFBSztlQUM5QzthQUNEO1dBQ0YsQ0FDTjtTQUNIOzs7O1dBZmtCLE1BQU07S0FBUyxLQUFLLENBQUMsU0FBUzs7bUJBQTlCLE1BQU0sQzs7Ozs7Ozs7Ozs7Ozs7QUNJM0IsY0FBWSxDQUFDOzs7Ozs7Ozs7O01BR04sS0FBSyx1Q0FBTSxDQUFPOztNQUVKLFlBQVk7YUFBWixZQUFZOzRCQUFaLFlBQVk7Ozs7Ozs7Y0FBWixZQUFZOztpQkFBWixZQUFZO0FBRS9CLFlBQU07ZUFBQSxrQkFBRztBQUNQLGlCQUNFOzs7WUFDRTs7OzthQUF1QjtZQUN2Qjs7OzthQUFrRTtXQUM5RCxDQUNOO1NBQ0g7Ozs7V0FUa0IsWUFBWTtLQUFTLEtBQUssQ0FBQyxTQUFTOzttQkFBcEMsWUFBWSxDOzs7Ozs7QUNiakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7Ozs7OztBQ3pDQSw0Qzs7Ozs7O0FDQUEsc0M7Ozs7OztBQ0FBLG1DOzs7Ozs7QUNBQSwyQzs7Ozs7O0FDQUEsaUM7Ozs7OztBQ0FBLG1DOzs7Ozs7QUNBQSxxQzs7Ozs7O0FDQUEsbUM7Ozs7OztBQ0FBLHlDIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiLi9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA0ZjA3Njg2M2ZkMGZhYTg5N2MwNVxuICoqLyIsIi8qXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtvbnN0YW50aW4gVGFya3VzIChAa29pc3R5YSksIEtyaWFTb2Z0IExMQy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IERpc3BhdGNoZXIgZnJvbSAnLi9jb3JlL0Rpc3BhdGNoZXInO1xuaW1wb3J0IEFjdGlvblR5cGVzIGZyb20gJy4vY29uc3RhbnRzL0FjdGlvblR5cGVzJztcbmltcG9ydCBBcHBTdG9yZSBmcm9tICcuL3N0b3Jlcy9BcHBTdG9yZSc7XG5cbnZhciBzZXJ2ZXIgPSBleHByZXNzKCk7XG5cbnNlcnZlci5zZXQoJ3BvcnQnLCAocHJvY2Vzcy5lbnYuUE9SVCB8fCA5OTk5KSk7XG5zZXJ2ZXIudXNlKGV4cHJlc3Muc3RhdGljKHBhdGguam9pbihfX2Rpcm5hbWUpKSk7XG5cbi8vXG4vLyBQYWdlIEFQSVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnNlcnZlci5nZXQoJy9hcGkvcGFnZS8qJywgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgdmFyIHVybFBhdGggPSByZXEucGF0aC5zdWJzdHIoOSk7XG4gIHZhciBwYWdlID0gQXBwU3RvcmUuZ2V0UGFnZSh1cmxQYXRoKTtcbiAgcmVzLnNlbmQocGFnZSk7XG59KTtcblxuLy9cbi8vIFNlcnZlci1zaWRlIHJlbmRlcmluZ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gVGhlIHRvcC1sZXZlbCBSZWFjdCBjb21wb25lbnQgKyBIVE1MIHRlbXBsYXRlIGZvciBpdFxudmFyIEFwcCA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkocmVxdWlyZSgnLi9jb21wb25lbnRzL0FwcCcpKTtcbnZhciB0ZW1wbGF0ZUZpbGUgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVtcGxhdGVzL2luZGV4Lmh0bWwnKTtcbnZhciB0ZW1wbGF0ZSA9IF8udGVtcGxhdGUoZnMucmVhZEZpbGVTeW5jKHRlbXBsYXRlRmlsZSwgJ3V0ZjgnKSk7XG5cbnNlcnZlci5nZXQoJyonLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICB2YXIgZGF0YSA9IHtkZXNjcmlwdGlvbjogJyd9O1xuICB2YXIgYXBwID0gbmV3IEFwcCh7XG4gICAgcGF0aDogcmVxLnBhdGgsXG4gICAgb25TZXRUaXRsZTogZnVuY3Rpb24odGl0bGUpIHsgZGF0YS50aXRsZSA9IHRpdGxlOyB9LFxuICAgIG9uU2V0TWV0YTogZnVuY3Rpb24obmFtZSwgY29udGVudCkgeyBkYXRhW25hbWVdID0gY29udGVudDsgfSxcbiAgICBvblBhZ2VOb3RGb3VuZDogZnVuY3Rpb24oKSB7IHJlcy5zdGF0dXMoNDA0KTsgfVxuICB9KTtcbiAgZGF0YS5ib2R5ID0gUmVhY3QucmVuZGVyVG9TdHJpbmcoYXBwKTtcbiAgdmFyIGh0bWwgPSB0ZW1wbGF0ZShkYXRhKTtcbiAgcmVzLnNlbmQoaHRtbCk7XG59KTtcblxuLy8gTG9hZCBwYWdlcyBmcm9tIHRoZSBgL3NyYy9jb250ZW50L2AgZm9sZGVyIGludG8gdGhlIEFwcFN0b3JlXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBhc3NpZ24gPSByZXF1aXJlKCdyZWFjdC9saWIvT2JqZWN0LmFzc2lnbicpO1xuICB2YXIgZm0gPSByZXF1aXJlKCdmcm9udC1tYXR0ZXInKTtcbiAgdmFyIGphZGUgPSByZXF1aXJlKCdqYWRlJyk7XG4gIHZhciBzb3VyY2VEaXIgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9jb250ZW50Jyk7XG4gIHZhciBnZXRGaWxlcyA9IGZ1bmN0aW9uKGRpcikge1xuICAgIHZhciBwYWdlcyA9IFtdO1xuICAgIGZzLnJlYWRkaXJTeW5jKGRpcikuZm9yRWFjaChmdW5jdGlvbihmaWxlKSB7XG4gICAgICB2YXIgc3RhdCA9IGZzLnN0YXRTeW5jKHBhdGguam9pbihkaXIsIGZpbGUpKTtcbiAgICAgIGlmIChzdGF0ICYmIHN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICBwYWdlcyA9IHBhZ2VzLmNvbmNhdChnZXRGaWxlcyhmaWxlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDb252ZXJ0IHRoZSBmaWxlIHRvIGEgUGFnZSBvYmplY3RcbiAgICAgICAgdmFyIGZpbGVuYW1lID0gcGF0aC5qb2luKGRpciwgZmlsZSk7XG4gICAgICAgIHZhciB1cmwgPSBmaWxlbmFtZS5cbiAgICAgICAgICBzdWJzdHIoc291cmNlRGlyLmxlbmd0aCwgZmlsZW5hbWUubGVuZ3RoIC0gc291cmNlRGlyLmxlbmd0aCAtIDUpXG4gICAgICAgICAgLnJlcGxhY2UoJ1xcXFwnLCAnLycpO1xuICAgICAgICBpZiAodXJsLmluZGV4T2YoJy9pbmRleCcsIHVybC5sZW5ndGggLSA2KSAhPT0gLTEpIHtcbiAgICAgICAgICB1cmwgPSB1cmwuc3Vic3RyKDAsIHVybC5sZW5ndGggLSAodXJsLmxlbmd0aCA+IDYgPyA2IDogNSkpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzb3VyY2UgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGY4Jyk7XG4gICAgICAgIHZhciBjb250ZW50ID0gZm0oc291cmNlKTtcbiAgICAgICAgdmFyIGh0bWwgPSBqYWRlLnJlbmRlcihjb250ZW50LmJvZHksIG51bGwsICcgICcpO1xuICAgICAgICB2YXIgcGFnZSA9IGFzc2lnbih7fSwge3BhdGg6IHVybCwgYm9keTogaHRtbH0sIGNvbnRlbnQuYXR0cmlidXRlcyk7XG4gICAgICAgIERpc3BhdGNoZXIuaGFuZGxlU2VydmVyQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25UeXBlOiBBY3Rpb25UeXBlcy5MT0FEX1BBR0UsXG4gICAgICAgICAgcGF0aDogdXJsLFxuICAgICAgICAgIHBhZ2U6IHBhZ2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHBhZ2VzO1xuICB9O1xuICByZXR1cm4gZ2V0RmlsZXMoc291cmNlRGlyKTtcbn0pKCk7XG5cbnNlcnZlci5saXN0ZW4oc2VydmVyLmdldCgncG9ydCcpLCBmdW5jdGlvbigpIHtcbiAgaWYgKHByb2Nlc3Muc2VuZCkge1xuICAgIHByb2Nlc3Muc2VuZCgnb25saW5lJyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coJ1RoZSBzZXJ2ZXIgaXMgcnVubmluZyBhdCBodHRwOi8vbG9jYWxob3N0OicgKyBzZXJ2ZXIuZ2V0KCdwb3J0JykpO1xuICB9XG59KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9lc2xpbnQtbG9hZGVyIS4vc3JjL3NlcnZlci5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJyZWFjdFwiXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypcbiAqIFJlYWN0LmpzIFN0YXJ0ZXIgS2l0XG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgS29uc3RhbnRpbiBUYXJrdXMgKEBrb2lzdHlhKSwgS3JpYVNvZnQgTExDLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBrZXlNaXJyb3IgZnJvbSAncmVhY3QvbGliL2tleU1pcnJvcic7XG5cbmV4cG9ydCBkZWZhdWx0IGtleU1pcnJvcih7XG5cbiAgTE9BRF9QT1NUUzogbnVsbCxcbiAgTE9BRF9QT1NUOiBudWxsLFxuICBMT0FEX1BBR0U6IG51bGwsXG4gIExPQURfUEFHRV9TVUNDRVNTOiBudWxsLFxuICBMT0FEX1BBR0VfRVJST1I6IG51bGwsXG4gIENIQU5HRV9MT0NBVElPTjogbnVsbFxuXG59KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9lc2xpbnQtbG9hZGVyIS4vc3JjL2NvbnN0YW50cy9BY3Rpb25UeXBlcy5qc1xuICoqLyIsIi8qXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtvbnN0YW50aW4gVGFya3VzIChAa29pc3R5YSksIEtyaWFTb2Z0IExMQy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQga2V5TWlycm9yIGZyb20gJ3JlYWN0L2xpYi9rZXlNaXJyb3InO1xuXG5leHBvcnQgZGVmYXVsdCBrZXlNaXJyb3Ioe1xuXG4gIFZJRVdfQUNUSU9OOiBudWxsLFxuICBTRVJWRVJfQUNUSU9OOiBudWxsXG5cbn0pO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvY29uc3RhbnRzL1BheWxvYWRTb3VyY2VzLmpzXG4gKiovIiwiLypcbiAqIFJlYWN0LmpzIFN0YXJ0ZXIgS2l0XG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgS29uc3RhbnRpbiBUYXJrdXMgKEBrb2lzdHlhKSwgS3JpYVNvZnQgTExDLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBGbHV4IGZyb20gJ2ZsdXgnO1xuaW1wb3J0IFBheWxvYWRTb3VyY2VzIGZyb20gJy4uL2NvbnN0YW50cy9QYXlsb2FkU291cmNlcyc7XG5pbXBvcnQgYXNzaWduIGZyb20gJ3JlYWN0L2xpYi9PYmplY3QuYXNzaWduJztcblxuLyoqXG4gKiBBIHNpbmdsZXRvbiB0aGF0IG9wZXJhdGVzIGFzIHRoZSBjZW50cmFsIGh1YiBmb3IgYXBwbGljYXRpb24gdXBkYXRlcy5cbiAqIEZvciBtb3JlIGluZm9ybWF0aW9uIHZpc2l0IGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL2ZsdXgvXG4gKi9cbmxldCBEaXNwYXRjaGVyID0gYXNzaWduKG5ldyBGbHV4LkRpc3BhdGNoZXIoKSwge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge29iamVjdH0gYWN0aW9uIFRoZSBkZXRhaWxzIG9mIHRoZSBhY3Rpb24sIGluY2x1ZGluZyB0aGUgYWN0aW9uJ3NcbiAgICogdHlwZSBhbmQgYWRkaXRpb25hbCBkYXRhIGNvbWluZyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBoYW5kbGVTZXJ2ZXJBY3Rpb24oYWN0aW9uKSB7XG4gICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICBzb3VyY2U6IFBheWxvYWRTb3VyY2VzLlNFUlZFUl9BQ1RJT04sXG4gICAgICBhY3Rpb246IGFjdGlvblxuICAgIH07XG4gICAgdGhpcy5kaXNwYXRjaChwYXlsb2FkKTtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtvYmplY3R9IGFjdGlvbiBUaGUgZGV0YWlscyBvZiB0aGUgYWN0aW9uLCBpbmNsdWRpbmcgdGhlIGFjdGlvbidzXG4gICAqIHR5cGUgYW5kIGFkZGl0aW9uYWwgZGF0YSBjb21pbmcgZnJvbSB0aGUgdmlldy5cbiAgICovXG4gIGhhbmRsZVZpZXdBY3Rpb24oYWN0aW9uKSB7XG4gICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICBzb3VyY2U6IFBheWxvYWRTb3VyY2VzLlZJRVdfQUNUSU9OLFxuICAgICAgYWN0aW9uOiBhY3Rpb25cbiAgICB9O1xuICAgIHRoaXMuZGlzcGF0Y2gocGF5bG9hZCk7XG4gIH1cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IERpc3BhdGNoZXI7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9jb3JlL0Rpc3BhdGNoZXIuanNcbiAqKi8iLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgT2JqZWN0LmFzc2lnblxuICovXG5cbi8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QuYXNzaWduXG5cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlcykge1xuICBpZiAodGFyZ2V0ID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIHRhcmdldCBjYW5ub3QgYmUgbnVsbCBvciB1bmRlZmluZWQnKTtcbiAgfVxuXG4gIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xuICB2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4gIGZvciAodmFyIG5leHRJbmRleCA9IDE7IG5leHRJbmRleCA8IGFyZ3VtZW50cy5sZW5ndGg7IG5leHRJbmRleCsrKSB7XG4gICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbbmV4dEluZGV4XTtcbiAgICBpZiAobmV4dFNvdXJjZSA9PSBudWxsKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgZnJvbSA9IE9iamVjdChuZXh0U291cmNlKTtcblxuICAgIC8vIFdlIGRvbid0IGN1cnJlbnRseSBzdXBwb3J0IGFjY2Vzc29ycyBub3IgcHJveGllcy4gVGhlcmVmb3JlIHRoaXNcbiAgICAvLyBjb3B5IGNhbm5vdCB0aHJvdy4gSWYgd2UgZXZlciBzdXBwb3J0ZWQgdGhpcyB0aGVuIHdlIG11c3QgaGFuZGxlXG4gICAgLy8gZXhjZXB0aW9ucyBhbmQgc2lkZS1lZmZlY3RzLiBXZSBkb24ndCBzdXBwb3J0IHN5bWJvbHMgc28gdGhleSB3b24ndFxuICAgIC8vIGJlIHRyYW5zZmVycmVkLlxuXG4gICAgZm9yICh2YXIga2V5IGluIGZyb20pIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcbiAgICAgICAgdG9ba2V5XSA9IGZyb21ba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcmVhY3QvbGliL09iamVjdC5hc3NpZ24uanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKlxuICogUmVhY3QuanMgU3RhcnRlciBLaXRcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLb25zdGFudGluIFRhcmt1cyAoQGtvaXN0eWEpLCBLcmlhU29mdCBMTEMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3VpZGVJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICByZW5kZXIoKSB7XG4gICAgdmFyIHBvc3QgPSB0aGlzLnByb3BzLnBvc3Q7XG4gICAgdmFyIHJlbmRlcmVyID0gbmV3IG1hcmtlZC5SZW5kZXJlcigpO1xuICAgIHJlbmRlcmVyLmNvZGUgPSBmdW5jdGlvbiAoY29kZSwgbGFuZ3VhZ2UpIHtcbiAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2UoL1tcXHUwMEEwLVxcdTk5OTk8PlxcJl0vZ2ltLCBmdW5jdGlvbihpKSB7XG4gICAgICAgcmV0dXJuICcmIycraS5jaGFyQ29kZUF0KDApKyc7JztcbiAgICAgIH0pO1xuICAgICAgdmFyIGxhbmd1YWdlQ2xhc3MgPSBcIlwiXG4gICAgICBpZiAobGFuZ3VhZ2UpIHtcbiAgICAgICAgbGFuZ3VhZ2VDbGFzcyA9IFwibGFuZ3VhZ2UtXCIgKyBsYW5ndWFnZVxuICAgICAgICB2YXIgZ3JhbW1lciA9IFByaXNtLmxhbmd1YWdlc1tsYW5ndWFnZV07XG4gICAgICAgIGlmIChncmFtbWVyKSB7XG4gICAgICAgICAgY29kZSA9IFByaXNtLmhpZ2hsaWdodChjb2RlLCBncmFtbWVyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gXCI8cHJlPjxjb2RlIGNsYXNzPSdcIiArIGxhbmd1YWdlQ2xhc3MgKyBcIic+XCIgKyBjb2RlICsgXCI8L2NvZGU+PC9wcmU+XCI7XG4gICAgfTtcblxuXG4gICAgdmFyIGNvbnRlbnQgPSBtYXJrZWQocG9zdC5jb250ZW50LCB7cmVuZGVyZXI6IHJlbmRlcmVyfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJndWlkZUJvZHlcIj5cbiAgICAgICAgPGgxIGNsYXNzTmFtZT1cImhlYWRlclwiPlxuICAgICAgICAgIHtwb3N0Lm1ldGFkYXRhLnRpdGxlfVxuICAgICAgICA8L2gxPlxuICAgICAgICA8cCBkYW5nZXJvdXNseVNldElubmVySFRNTD17e19faHRtbDogY29udGVudH19PlxuICAgICAgICA8L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbn1cblxuR3VpZGVJdGVtLnByb3BUeXBlcyA9IHtcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9jb21wb25lbnRzL0d1aWRlSXRlbS9HdWlkZUl0ZW0uanNcbiAqKi8iLCIvKlxuICogUmVhY3QuanMgU3RhcnRlciBLaXRcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLb25zdGFudGluIFRhcmt1cyAoQGtvaXN0eWEpLCBLcmlhU29mdCBMTEMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IERpc3BhdGNoZXIgZnJvbSAnLi4vY29yZS9EaXNwYXRjaGVyJztcbmltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICcuLi9jb25zdGFudHMvQWN0aW9uVHlwZXMnO1xuaW1wb3J0IFBheWxvYWRTb3VyY2VzIGZyb20gJy4uL2NvbnN0YW50cy9QYXlsb2FkU291cmNlcyc7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50ZW1pdHRlcjMnO1xuaW1wb3J0IGFzc2lnbiBmcm9tICdyZWFjdC9saWIvT2JqZWN0LmFzc2lnbic7XG5cbnZhciBDSEFOR0VfRVZFTlQgPSAnY2hhbmdlJztcblxudmFyIHBhZ2VzID0ge307XG52YXIgcG9zdHMgPSBbXTtcblxudmFyIGxvYWRpbmcgPSBmYWxzZTtcblxuaWYgKF9fU0VSVkVSX18pIHtcbiAgcGFnZXNbJy8nXSA9IHt0aXRsZTogJ0hvbWUgUGFnZSd9O1xuICBwYWdlc1snL3ByaXZhY3knXSA9IHt0aXRsZTogJ1ByaXZhY3kgUG9saWN5J307XG59XG5cbnZhciBBcHBTdG9yZSA9IGFzc2lnbih7fSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gIGlzTG9hZGluZygpIHtcbiAgICByZXR1cm4gbG9hZGluZztcbiAgfSxcblxuICAvKipcbiAgICogR2V0cyBwYWdlIGRhdGEgYnkgdGhlIGdpdmVuIFVSTCBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBVUkwgcGF0aC5cbiAgICogQHJldHVybnMgeyp9IFBhZ2UgZGF0YS5cbiAgICovXG4gIGdldFBhZ2UocGF0aCkge1xuICAgIHJldHVybiBwYXRoIGluIHBhZ2VzID8gcGFnZXNbcGF0aF0gOiB7XG4gICAgICB0aXRsZTogJ1BhZ2UgTm90IEZvdW5kJyxcbiAgICAgIHR5cGU6ICdub3Rmb3VuZCdcbiAgICB9O1xuICB9LFxuXG4gIGdldFBvc3RzKCkge1xuICAgIHJldHVybiBwb3N0cztcbiAgfSxcblxuICAvKipcbiAgICogRW1pdHMgY2hhbmdlIGV2ZW50IHRvIGFsbCByZWdpc3RlcmVkIGV2ZW50IGxpc3RlbmVycy5cbiAgICpcbiAgICogQHJldHVybnMge0Jvb2xlYW59IEluZGljYXRpb24gaWYgd2UndmUgZW1pdHRlZCBhbiBldmVudC5cbiAgICovXG4gIGVtaXRDaGFuZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdChDSEFOR0VfRVZFTlQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIG5ldyBjaGFuZ2UgZXZlbnQgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKi9cbiAgb25DaGFuZ2UoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgY2hhbmdlIGV2ZW50IGxpc3RlbmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbi5cbiAgICovXG4gIG9mZihjYWxsYmFjaykge1xuICAgIHRoaXMub2ZmKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG5cbn0pO1xuXG5BcHBTdG9yZS5kaXNwYXRjaGVyVG9rZW4gPSBEaXNwYXRjaGVyLnJlZ2lzdGVyKChwYXlsb2FkKSA9PiB7XG4gIHZhciBhY3Rpb24gPSBwYXlsb2FkLmFjdGlvbjtcblxuICBzd2l0Y2ggKGFjdGlvbi5hY3Rpb25UeXBlKSB7XG5cbiAgICBjYXNlIEFjdGlvblR5cGVzLkxPQURfUEFHRTpcbiAgICAgIGlmIChhY3Rpb24uc291cmNlID09PSBQYXlsb2FkU291cmNlcy5WSUVXX0FDVElPTikge1xuICAgICAgICBsb2FkaW5nID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFhY3Rpb24uZXJyKSB7XG4gICAgICAgICAgcGFnZXNbYWN0aW9uLnBhdGhdID0gYWN0aW9uLnBhZ2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIEFwcFN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBBY3Rpb25UeXBlcy5MT0FEX1BPU1RTOlxuICAgICAgY29uc29sZS5sb2coYWN0aW9uKVxuICAgICAgaWYgKGFjdGlvbi5zb3VyY2UgPT09IFBheWxvYWRTb3VyY2VzLlZJRVdfQUNUSU9OKSB7XG4gICAgICAgIGxvYWRpbmcgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICBpZiAoIWFjdGlvbi5lcnIpIHtcbiAgICAgICAgICBwb3N0cyA9IGFjdGlvbi5wb3N0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgQXBwU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgLy8gRG8gbm90aGluZ1xuXG4gIH1cblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEFwcFN0b3JlO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvc3RvcmVzL0FwcFN0b3JlLmpzXG4gKiovIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGludmFyaWFudFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgaW52YXJpYW50ID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgaWYgKFwicHJvZHVjdGlvblwiICE9PSBwcm9jZXNzLmVudi5OT0RFX0VOVikge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICtcbiAgICAgICAgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJ1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdJbnZhcmlhbnQgVmlvbGF0aW9uOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJnc1thcmdJbmRleCsrXTsgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3JlYWN0L2xpYi9pbnZhcmlhbnQuanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUga2V5TWlycm9yXG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoXCIuL2ludmFyaWFudFwiKTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGFuIGVudW1lcmF0aW9uIHdpdGgga2V5cyBlcXVhbCB0byB0aGVpciB2YWx1ZS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgIHZhciBDT0xPUlMgPSBrZXlNaXJyb3Ioe2JsdWU6IG51bGwsIHJlZDogbnVsbH0pO1xuICogICB2YXIgbXlDb2xvciA9IENPTE9SUy5ibHVlO1xuICogICB2YXIgaXNDb2xvclZhbGlkID0gISFDT0xPUlNbbXlDb2xvcl07XG4gKlxuICogVGhlIGxhc3QgbGluZSBjb3VsZCBub3QgYmUgcGVyZm9ybWVkIGlmIHRoZSB2YWx1ZXMgb2YgdGhlIGdlbmVyYXRlZCBlbnVtIHdlcmVcbiAqIG5vdCBlcXVhbCB0byB0aGVpciBrZXlzLlxuICpcbiAqICAgSW5wdXQ6ICB7a2V5MTogdmFsMSwga2V5MjogdmFsMn1cbiAqICAgT3V0cHV0OiB7a2V5MToga2V5MSwga2V5Mjoga2V5Mn1cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbnZhciBrZXlNaXJyb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHJldCA9IHt9O1xuICB2YXIga2V5O1xuICAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WID8gaW52YXJpYW50KFxuICAgIG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopLFxuICAgICdrZXlNaXJyb3IoLi4uKTogQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QuJ1xuICApIDogaW52YXJpYW50KG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopKSk7XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXRba2V5XSA9IGtleTtcbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3I7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9yZWFjdC9saWIva2V5TWlycm9yLmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypcbiAqIFJlYWN0LmpzIFN0YXJ0ZXIgS2l0XG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgS29uc3RhbnRpbiBUYXJrdXMgKEBrb2lzdHlhKSwgS3JpYVNvZnQgTExDLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBEaXNwYXRjaGVyIGZyb20gJy4uL2NvcmUvRGlzcGF0Y2hlcic7XG5pbXBvcnQgQWN0aW9uVHlwZXMgZnJvbSAnLi4vY29uc3RhbnRzL0FjdGlvblR5cGVzJztcbmltcG9ydCBQYXlsb2FkU291cmNlcyBmcm9tICcuLi9jb25zdGFudHMvUGF5bG9hZFNvdXJjZXMnO1xuaW1wb3J0IEV4ZWN1dGlvbkVudmlyb25tZW50IGZyb20gJ3JlYWN0L2xpYi9FeGVjdXRpb25FbnZpcm9ubWVudCc7XG5pbXBvcnQgaHR0cCBmcm9tICdzdXBlcmFnZW50JztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIG5hdmlnYXRlVG8ocGF0aCwgb3B0aW9ucykge1xuICAgIGlmIChFeGVjdXRpb25FbnZpcm9ubWVudC5jYW5Vc2VET00pIHtcbiAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucmVwbGFjZSkge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe30sIGRvY3VtZW50LnRpdGxlLCBwYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgZG9jdW1lbnQudGl0bGUsIHBhdGgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7XG4gICAgICBhY3Rpb25UeXBlOiBBY3Rpb25UeXBlcy5DSEFOR0VfTE9DQVRJT04sXG4gICAgICBwYXRoXG4gICAgfSk7XG4gIH0sXG5cbiAgbGlzdFBvc3RzKGNiKSB7XG4gICAgXG4gICAgRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcbiAgICAgIGFjdGlvblR5cGU6IEFjdGlvblR5cGVzLkxPQURfUE9TVFMsXG4gICAgICBzb3VyY2U6IFBheWxvYWRTb3VyY2VzLlZJRVdfQUNUSU9OLFxuICAgICAgcG9zdHM6IFtdXG4gICAgfSk7XG5cbiAgICBodHRwLmdldCgnL2FwaS9wb3N0cycpXG4gICAgICAuYWNjZXB0KCdhcHBsaWNhdGlvbi9qc29uJylcbiAgICAgIC5lbmQoKGVyciwgcmVzKSA9PiB7XG4gICAgICAgIERpc3BhdGNoZXIuaGFuZGxlU2VydmVyQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25UeXBlOiBBY3Rpb25UeXBlcy5MT0FEX1BPU1RTLFxuICAgICAgICAgIGVycixcbiAgICAgICAgICBwb3N0czogcmVzLmJvZHkucG9zdHNcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjYikge1xuICAgICAgICAgIGNiKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9LFxuXG4gIGxvYWRQYWdlKHBhdGgsIGNiKSB7XG4gICAgRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcbiAgICAgIGFjdGlvblR5cGU6IEFjdGlvblR5cGVzLkxPQURfUEFHRSxcbiAgICAgIHBhdGhcbiAgICB9KTtcblxuICAgIGh0dHAuZ2V0KCcvYXBpL3BhZ2UnICsgcGF0aClcbiAgICAgIC5hY2NlcHQoJ2FwcGxpY2F0aW9uL2pzb24nKVxuICAgICAgLmVuZCgoZXJyLCByZXMpID0+IHtcbiAgICAgICAgRGlzcGF0Y2hlci5oYW5kbGVTZXJ2ZXJBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvblR5cGU6IEFjdGlvblR5cGVzLkxPQURfUEFHRSxcbiAgICAgICAgICBwYXRoLFxuICAgICAgICAgIGVycixcbiAgICAgICAgICBwYWdlOiByZXMuYm9keVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY2IoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9lc2xpbnQtbG9hZGVyIS4vc3JjL2FjdGlvbnMvQXBwQWN0aW9ucy5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAncmVhY3QvbGliL2ludmFyaWFudCc7XG5pbXBvcnQgQXBwQWN0aW9ucyBmcm9tICcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMnO1xuaW1wb3J0IEFwcFN0b3JlIGZyb20gJy4uLy4uL3N0b3Jlcy9BcHBTdG9yZSc7XG5pbXBvcnQgTmF2YmFyIGZyb20gJy4uL05hdmJhcic7XG5pbXBvcnQgQ29udGVudFBhZ2UgZnJvbSAnLi4vQ29udGVudFBhZ2UnO1xuaW1wb3J0IEd1aWRlSXRlbSBmcm9tICcuLi9HdWlkZUl0ZW0nO1xuaW1wb3J0IE5vdEZvdW5kUGFnZSBmcm9tICcuLi9Ob3RGb3VuZFBhZ2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIHRoaXMuaGFuZGxlUG9wU3RhdGUpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgdGhpcy5oYW5kbGVQb3BTdGF0ZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVDbGljayk7XG4gIH1cblxuICBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGF0aCAhPT0gbmV4dFByb3BzLnBhdGg7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIHBhZ2UgPSBBcHBTdG9yZS5nZXRQYWdlKHRoaXMucHJvcHMucGF0aCk7XG4gICAgaW52YXJpYW50KHBhZ2UgIT09IHVuZGVmaW5lZCwgJ0ZhaWxlZCB0byBsb2FkIHBhZ2UgY29udGVudC4nKTtcbiAgICB0aGlzLnByb3BzLm9uU2V0VGl0bGUocGFnZS50aXRsZSk7XG5cbiAgICBpZiAocGFnZS50eXBlID09PSAnbm90Zm91bmQnKSB7XG4gICAgICB0aGlzLnByb3BzLm9uUGFnZU5vdEZvdW5kKCk7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChOb3RGb3VuZFBhZ2UsIHBhZ2UpO1xuICAgIH1cblxuICAgIHZhciBwb3N0cyA9IEFwcFN0b3JlLmdldFBvc3RzKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJBcHBcIj5cbiAgICAgICAgPE5hdmJhciAvPlxuICAgICAgICA8Q29udGVudFBhZ2UgY2xhc3NOYW1lPVwiY29udGFpbmVyXCIgcG9zdHM9e3Bvc3RzfSB7Li4ucGFnZX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBoYW5kbGVQb3BTdGF0ZShldmVudCkge1xuICAgIEFwcEFjdGlvbnMubmF2aWdhdGVUbyh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsIHtyZXBsYWNlOiAhIWV2ZW50LnN0YXRlfSk7XG4gIH1cblxuICBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGlmIChldmVudC5idXR0b24gPT09IDEgfHwgZXZlbnQubWV0YUtleSB8fCBldmVudC5jdHJsS2V5IHx8IGV2ZW50LnNoaWZ0S2V5IHx8IGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBFbnN1cmUgbGlua1xuICAgIHZhciBlbCA9IGV2ZW50LnRhcmdldDtcbiAgICB3aGlsZSAoZWwgJiYgZWwubm9kZU5hbWUgIT09ICdBJykge1xuICAgICAgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIH1cbiAgICBpZiAoIWVsIHx8IGVsLm5vZGVOYW1lICE9PSAnQScpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZ25vcmUgaWYgdGFnIGhhc1xuICAgIC8vIDEuIFwiZG93bmxvYWRcIiBhdHRyaWJ1dGVcbiAgICAvLyAyLiByZWw9XCJleHRlcm5hbFwiIGF0dHJpYnV0ZVxuICAgIGlmIChlbC5nZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJykgfHwgZWwuZ2V0QXR0cmlidXRlKCdyZWwnKSA9PT0gJ2V4dGVybmFsJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEVuc3VyZSBub24taGFzaCBmb3IgdGhlIHNhbWUgcGF0aFxuICAgIHZhciBsaW5rID0gZWwuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgaWYgKGVsLnBhdGhuYW1lID09PSBsb2NhdGlvbi5wYXRobmFtZSAmJiAoZWwuaGFzaCB8fCBsaW5rID09PSAnIycpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIG1haWx0bzogaW4gdGhlIGhyZWZcbiAgICBpZiAobGluayAmJiBsaW5rLmluZGV4T2YoJ21haWx0bzonKSA+IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgdGFyZ2V0XG4gICAgaWYgKGVsLnRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFgtb3JpZ2luXG4gICAgdmFyIG9yaWdpbiA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgK1xuICAgICAgKHdpbmRvdy5sb2NhdGlvbi5wb3J0ID8gJzonICsgd2luZG93LmxvY2F0aW9uLnBvcnQgOiAnJyk7XG4gICAgaWYgKCEoZWwuaHJlZiAmJiBlbC5ocmVmLmluZGV4T2Yob3JpZ2luKSA9PT0gMCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZWJ1aWxkIHBhdGhcbiAgICB2YXIgcGF0aCA9IGVsLnBhdGhuYW1lICsgZWwuc2VhcmNoICsgKGVsLmhhc2ggfHwgJycpO1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBBcHBBY3Rpb25zLmxpc3RQb3N0cygoKSA9PiB7XG4gICAgICBBcHBBY3Rpb25zLm5hdmlnYXRlVG8ocGF0aCk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5BcHAucHJvcFR5cGVzID0ge1xuICBwYXRoOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG9uU2V0VGl0bGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uU2V0TWV0YTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb25QYWdlTm90Rm91bmQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9jb21wb25lbnRzL0FwcC9BcHAuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgR3VpZGVJdGVtIGZyb20gJy4uL0d1aWRlSXRlbSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnRQYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICByZW5kZXIoKSB7XG4gICAgdmFyIHBvc3RzID0gdGhpcy5wcm9wcy5wb3N0cztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAge3Bvc3RzLm1hcChmdW5jdGlvbihvYmplY3QsIGkpe1xuICAgICAgICAgIHJldHVybiA8ZGl2PlxuICAgICAgICAgICAgPEd1aWRlSXRlbSBwb3N0PXtvYmplY3R9IGtleT17aX0gLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGl2aWRlclwiPjwvZGl2PlxuICAgICAgICAgIDwvZGl2PjtcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbn1cblxuQ29udGVudFBhZ2UucHJvcFR5cGVzID0ge1xuICBib2R5OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vZXNsaW50LWxvYWRlciEuL3NyYy9jb21wb25lbnRzL0NvbnRlbnRQYWdlL0NvbnRlbnRQYWdlLmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOYXZiYXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPG5hdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5hdi13cmFwcGVyXCI+XG4gICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzc05hbWU9XCJicmFuZC1sb2dvIGxlZnRcIj5HZXR0aW5nLVN0YXJ0ZWQubWQ8L2E+XG4gICAgICAgICAgPHVsIGlkPVwibmF2LW1vYmlsZVwiIGNsYXNzTmFtZT1cInJpZ2h0IGhpZGUtb24tbWVkLWFuZC1kb3duXCI+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIi9ndWlkZXNcIj5HdWlkZXM8L2E+PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiL3ZpZGVvc1wiPlZpZGVvczwvYT48L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vc3RydWN0LnR2XCI+Q2hhdCBMaXZlPC9hPjwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L25hdj5cbiAgICApO1xuICB9XG5cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi9lc2xpbnQtbG9hZGVyIS4vc3JjL2NvbXBvbmVudHMvTmF2YmFyL05hdmJhci5qc1xuICoqLyIsIi8qXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtvbnN0YW50aW4gVGFya3VzIChAa29pc3R5YSksIEtyaWFTb2Z0IExMQy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdEZvdW5kUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8aDE+UGFnZSBOb3QgRm91bmQ8L2gxPlxuICAgICAgICA8cD5Tb3JyeSwgYnV0IHRoZSBwYWdlIHlvdSB3ZXJlIHRyeWluZyB0byB2aWV3IGRvZXMgbm90IGV4aXN0LjwvcD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L2VzbGludC1sb2FkZXIhLi9zcmMvY29tcG9uZW50cy9Ob3RGb3VuZFBhZ2UvTm90Rm91bmRQYWdlLmpzXG4gKiovIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIEV4ZWN1dGlvbkVudmlyb25tZW50XG4gKi9cblxuLypqc2xpbnQgZXZpbDogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGNhblVzZURPTSA9ICEhKFxuICAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgd2luZG93LmRvY3VtZW50ICYmIHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KVxuKTtcblxuLyoqXG4gKiBTaW1wbGUsIGxpZ2h0d2VpZ2h0IG1vZHVsZSBhc3Npc3Rpbmcgd2l0aCB0aGUgZGV0ZWN0aW9uIGFuZCBjb250ZXh0IG9mXG4gKiBXb3JrZXIuIEhlbHBzIGF2b2lkIGNpcmN1bGFyIGRlcGVuZGVuY2llcyBhbmQgYWxsb3dzIGNvZGUgdG8gcmVhc29uIGFib3V0XG4gKiB3aGV0aGVyIG9yIG5vdCB0aGV5IGFyZSBpbiBhIFdvcmtlciwgZXZlbiBpZiB0aGV5IG5ldmVyIGluY2x1ZGUgdGhlIG1haW5cbiAqIGBSZWFjdFdvcmtlcmAgZGVwZW5kZW5jeS5cbiAqL1xudmFyIEV4ZWN1dGlvbkVudmlyb25tZW50ID0ge1xuXG4gIGNhblVzZURPTTogY2FuVXNlRE9NLFxuXG4gIGNhblVzZVdvcmtlcnM6IHR5cGVvZiBXb3JrZXIgIT09ICd1bmRlZmluZWQnLFxuXG4gIGNhblVzZUV2ZW50TGlzdGVuZXJzOlxuICAgIGNhblVzZURPTSAmJiAhISh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciB8fCB3aW5kb3cuYXR0YWNoRXZlbnQpLFxuXG4gIGNhblVzZVZpZXdwb3J0OiBjYW5Vc2VET00gJiYgISF3aW5kb3cuc2NyZWVuLFxuXG4gIGlzSW5Xb3JrZXI6ICFjYW5Vc2VET00gLy8gRm9yIG5vdywgdGhpcyBpcyB0cnVlIC0gbWlnaHQgY2hhbmdlIGluIHRoZSBmdXR1cmUuXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXhlY3V0aW9uRW52aXJvbm1lbnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9yZWFjdC9saWIvRXhlY3V0aW9uRW52aXJvbm1lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAxNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXZlbnRlbWl0dGVyM1wiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiZXZlbnRlbWl0dGVyM1wiXG4gKiogbW9kdWxlIGlkID0gMTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImV4cHJlc3NcIlxuICoqIG1vZHVsZSBpZCA9IDE3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmbHV4XCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJmbHV4XCJcbiAqKiBtb2R1bGUgaWQgPSAxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnJvbnQtbWF0dGVyXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJmcm9udC1tYXR0ZXJcIlxuICoqIG1vZHVsZSBpZCA9IDE5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiZnNcIlxuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqYWRlXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJqYWRlXCJcbiAqKiBtb2R1bGUgaWQgPSAyMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJsb2Rhc2hcIlxuICoqIG1vZHVsZSBpZCA9IDIyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJwYXRoXCJcbiAqKiBtb2R1bGUgaWQgPSAyM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic3VwZXJhZ2VudFwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwic3VwZXJhZ2VudFwiXG4gKiogbW9kdWxlIGlkID0gMjRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIiwiZmlsZSI6InNlcnZlci5qcyJ9