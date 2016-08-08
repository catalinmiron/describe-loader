var esprima = require('esprima'),
    estraverse = require('estraverse'),
    escodegen = require('escodegen');


/**
 * Wrap the body of the describe expression in a describe with the path of the
 * file (__filename)
 *
 * @param {String} source
 *
 * @returns {String} The modified source.
 */
module.exports = function(source) {
  var shouldBreak = false,
      ast = esprima.parse(source);

  var newAst = estraverse.replace(ast, {
    enter: function(node, parent) {
      if (_isExpression(node, parent)) {
        return __wrapWithDescribeBlock(node);
      }

      return node;
    }
  });

  return escodegen.generate(newAst);
};


function _isExpression(node, parent) {
  return parent.type === 'Program' &&
         node.type === 'ExpressionStatement' &&
         node.expression.callee &&
         node.expression.callee.name === 'describe';
}


function __wrapWithDescribeBlock(node) {
  var firstArg = node.expression.arguments[0],
      secondArg = node.expression.arguments[1];

  node.expression = {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: 'describe'
    },
    arguments: [{
      type: 'Literal',
      value: firstArg.value
    }, {
      type: "FunctionExpression",
      params: [],
      body: {
        type: "BlockStatement",
        body: [{
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'describe'
            },
            arguments: [{
              "type": "BinaryExpression",
              "operator": "+",
              "left": {
                  "type": "Literal",
                  "value": "Path: ",
                  "raw": "'Path: '"
              },
              "right": {
                  "type": "Identifier",
                  "name": "__filename"
              }
            }, secondArg]
          }
        }],
        directives: []
      }
    }]
  }

  return node;
}
