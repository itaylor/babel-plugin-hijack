'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (babel) {
  var t = babel.types;
  return {
    visitor: {
      ImportDeclaration: function ImportDeclaration(path, state) {
        var origSource = path.get('source');
        var origSourceVal = origSource.node.value;
        var hijackedSourceVal = hijack(origSourceVal, state);
        if (origSourceVal !== hijackedSourceVal) {
          origSource.replaceWith(t.stringLiteral(hijackedSourceVal));
        }
      },
      CallExpression: function CallExpression(path, state) {
        var callee = path.get('callee');
        if (callee.isIdentifier() && callee.node.name === 'require') {
          var origSource = path.get('arguments.0');
          var origSourceVal = origSource.node.value;
          var hijackedSourceVal = hijack(origSourceVal, state);
          if (origSource !== hijackedSourceVal) {
            origSource.replaceWith(t.stringLiteral(hijackedSourceVal));
          }
        }
      }
    }
  };
};

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolveRelativeUrls(url, base) {
  if (url && url.indexOf('.') === 0) {
    return (0, _path.resolve)(base, url);
  }
  return (0, _path.normalize)(url);
} /**
  * A babel plugin that allows you to replace requires or imports with alternate requires or imports
  * In your .babelrc:
  */
// {
//   "presets": ["es2015"],
//   "plugins": ["hijack", {
//     "**/path/to/something.*": "thing/to/replace/it/with"
//   }]
// }

function hijack(url, state) {
  var _state$opts = state.opts;
  var hijacks = _state$opts === undefined ? {} : _state$opts;

  var resolvedUrl = resolveRelativeUrls(url, (0, _path.dirname)(state.file.opts.filename));
  var keys = Object.keys(hijacks);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      var match = url === key || (0, _minimatch2.default)(resolvedUrl, key);
      if (match) {
        return hijacks[key];
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return url;
}