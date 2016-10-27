'use strict';

var errorMessage = '\n    Variables within a declaration group should be sorted by the require name.\n'.trim();

module.exports = {
    meta: {},
    create: function create(context) {
        var hasRequire = /require\(\s*([^)]+)\s*\)/;
        var sourceCode = context.getSourceCode();
        var previousRequireVal = void 0;
        var previousNode = void 0;

        function shouldStartNewGroup(node, previousNode) {
            var lineOfNode = sourceCode.getFirstToken(node).loc.start.line;
            var lineOfPrev = sourceCode.getLastToken(previousNode).loc.start.line;
            return lineOfNode - lineOfPrev > 1;
        }

        return {
            VariableDeclaration: function VariableDeclaration(node) {
                var scope = context.getScope();

                if (scope.upper != null) {
                    // Not in the global scope, abort
                    return;
                }

                if (node.declarations.length > 1) {
                    // Multiple declarations in one declaration. Another rule
                    // will complain about this. abort!
                    return;
                }

                var declarator = node.declarations[0];

                if (declarator.init == null) {
                    // We're not setting this variable to anything, abort!
                    return;
                }

                var declaration = sourceCode.getText(declarator.init);

                var match = declaration.match(hasRequire);
                if (!match) {
                    // No require(), abort!
                    return;
                }

                var requireVal = match[1];

                if (previousRequireVal) {
                    if (shouldStartNewGroup(node, previousNode)) {
                        previousRequireVal = null;
                        previousNode = null;
                        return;
                    }

                    if (previousRequireVal > requireVal) {
                        context.report({
                            message: errorMessage,
                            node: node
                        });
                    }
                }

                previousRequireVal = requireVal;
                previousNode = node;
            },
            LineComment: function LineComment(node) {
                var scope = context.getScope();

                if (scope.upper != null) {
                    // Not in the global scope, abort
                    return;
                }

                previousNode = node;
            },
            BlockComment: function BlockComment(node) {
                var scope = context.getScope();

                if (scope.upper != null) {
                    // Not in the global scope, abort
                    return;
                }

                previousNode = node;
            }
        };
    },

    errorMessage: errorMessage
};