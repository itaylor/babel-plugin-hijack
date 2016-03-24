/**
* A babel plugin that allows you to replace requires or imports with alternate requires or imports
* In your .babelrc:
*/
// {
//   "presets": ["es2015"],
//   "plugins": ["hijack", {
//     "**/path/to/something.*": "thing/to/replace/it/with"
//   }]
// }

import minimatch from 'minimatch';
import { resolve, dirname, normalize } from 'path';

export default function (babel) {
  const t = babel.types;
  return {
    visitor: {
      ImportDeclaration: (path, state) => {
        const origSource = path.get('source');
        const origSourceVal = origSource.node.value;
        const hijackedSourceVal = hijack(origSourceVal, state);
        if (origSourceVal !== hijackedSourceVal) {
          origSource.replaceWith(t.stringLiteral(hijackedSourceVal));
        }
      },
      CallExpression: (path, state) => {
        const callee = path.get('callee');
        if (callee.isIdentifier() && callee.node.name === 'require') {
          const origSource = path.get('arguments.0');
          const origSourceVal = origSource.node.value;
          const hijackedSourceVal = hijack(origSourceVal, state);
          if (origSource !== hijackedSourceVal) {
            origSource.replaceWith(t.stringLiteral(hijackedSourceVal));
          }
        }
      },
    },
  };
}

function resolveRelativeUrls(url, base) {
  if (url && url.indexOf('.') === 0) {
    return resolve(base, url);
  }
  return normalize(url);
}

function hijack(url, state) {
  const { opts: hijacks = {} } = state;
  const resolvedUrl = resolveRelativeUrls(url, dirname(state.file.opts.filename));
  const keys = Object.keys(hijacks);
  for (const key of keys) {
    const match = url === key || minimatch(resolvedUrl, key);
    if (match) {
      return hijacks[key];
    }
  }
  return url;
}
