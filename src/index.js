import template from 'babel-template';
import syntax from 'babel-plugin-syntax-dynamic-import';
import {identifier as id, callExpression as call, stringLiteral as str, blockStatement as block, isStringLiteral,
  arrayExpression, arrowFunctionExpression } from 'babel-types';

const TYPE_IMPORT = 'Import';

const importStatement = template(`
  (new Promise((resolve) => {
    ENSURE
  }))
`);

const requireBody = template(`
  {
    resolve(require(SOURCE));
  }
`);

function buildImport(importSource, requireName) {
  const argumentsList = [arrayExpression(), arrowFunctionExpression(
    [id('require')],
    requireBody({
      SOURCE: importSource,
    }),
  )];
  if (requireName) {
    argumentsList.push(str(requireName));
  }
  return importStatement({
    ENSURE: call(id('require.ensure'), argumentsList),
  });
}

export default () => ({
  inherits: syntax,
  visitor: {
    CallExpression(path) {
      if (path.node.callee.type === TYPE_IMPORT) {
        const source = path.node.arguments[0];
        let newImport;
        if (!isStringLiteral(source)) {
          newImport = buildImport(path.node.arguments);
        } else {
          const value = source.value;
          const [importSource, requireName] = value.split('?chunkName=');
          newImport = buildImport(str(importSource), requireName);
        }
        path.replaceWith(newImport);
      }
    },
  },
});
