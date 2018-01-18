'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUrlParams = exports.parseQuery = exports.makeQuery = exports.removeParam = exports.addParam = undefined;

var _dissoc = require('ramda/src/dissoc');

var _dissoc2 = _interopRequireDefault(_dissoc);

var _pathOr = require('ramda/src/pathOr');

var _pathOr2 = _interopRequireDefault(_pathOr);

var _identity = require('ramda/src/identity');

var _identity2 = _interopRequireDefault(_identity);

var _tail = require('ramda/src/tail');

var _tail2 = _interopRequireDefault(_tail);

var _head = require('ramda/src/head');

var _head2 = _interopRequireDefault(_head);

var _ifElse = require('ramda/src/ifElse');

var _ifElse2 = _interopRequireDefault(_ifElse);

var _filter = require('ramda/src/filter');

var _filter2 = _interopRequireDefault(_filter);

var _assoc = require('ramda/src/assoc');

var _assoc2 = _interopRequireDefault(_assoc);

var _split = require('ramda/src/split');

var _split2 = _interopRequireDefault(_split);

var _reduce = require('ramda/src/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _keys = require('ramda/src/keys');

var _keys2 = _interopRequireDefault(_keys);

var _map = require('ramda/src/map');

var _map2 = _interopRequireDefault(_map);

var _join = require('ramda/src/join');

var _join2 = _interopRequireDefault(_join);

var _concat = require('ramda/src/concat');

var _concat2 = _interopRequireDefault(_concat);

var _compose = require('ramda/src/compose');

var _compose2 = _interopRequireDefault(_compose);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: add support for arrays

// =======
// Actions
var addParam = exports.addParam = function addParam(key, param) {
  return {
    type: 'url-redux/ADD_PARAM',
    payload: { key: key, param: param }
  };
};
var removeParam = exports.removeParam = function removeParam(key) {
  return {
    type: 'url-redux/REMOVE_PARAM',
    payload: { key: key }
  };
};

// ================
// Helper functions
var makeQuery = exports.makeQuery = function makeQuery(params) {
  return (0, _compose2.default)((0, _concat2.default)('?'), (0, _join2.default)('&'), (0, _map2.default)(function (key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }), _keys2.default)(params);
};

var parseQuery = exports.parseQuery = function parseQuery(query) {
  return (0, _compose2.default)((0, _reduce2.default)(function (acc, keyParam) {
    var _R$split = (0, _split2.default)('=')(keyParam),
        _R$split2 = _slicedToArray(_R$split, 2),
        key = _R$split2[0],
        param = _R$split2[1];

    return (0, _assoc2.default)(key, param, acc);
  }, {}), (0, _filter2.default)(Boolean), (0, _split2.default)('&'), (0, _ifElse2.default)(function (query) {
    return (0, _head2.default)(query) === '?';
  }, _tail2.default, _identity2.default))(query);
};

var pushUrlToWindow = function pushUrlToWindow(query) {
  if (!window) return;
  window.history.pushState({}, null, '' + window.location.origin + window.location.pathname + query);
};

// ======
// Reducer
var INITIAL_STATE = (0, _compose2.default)(parseQuery, (0, _pathOr2.default)('', ['location', 'search']))(window);

var urlReducer = function urlReducer() {
  var pushUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : pushUrlToWindow;
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
    var action = arguments[1];

    if (!window) return state; // Server rendering
    switch (action.type) {
      case 'url-redux/ADD_PARAM':
        var addedParams = (0, _assoc2.default)(action.payload.key, action.payload.param, state.url);
        pushUrl(makeQuery(addedParams));
        return addedParams;
      case 'url-redux/REMOVE_PARAM':
        var removedParams = (0, _dissoc2.default)(action.payload.key, state);
        pushUrl(makeQuery(removedParams));
        return removedParams;
      default:
        return state;
    }
  };
};

// ========
// Selector
// Can be used only if this reducer is under "url"
var getUrlParams = exports.getUrlParams = function getUrlParams(state) {
  return state.url;
};

exports.default = urlReducer;