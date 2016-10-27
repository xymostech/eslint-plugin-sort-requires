'use strict';

const errorMessage = `
    Variables within a declaration group should be sorted by the require name.
`.trim();

module.exports = {
    meta: {},
    create(context) {
        const hasRequire = /require\(\s*([^)]+)\s*\)/;
        const sourceCode = context.getSourceCode();
        let previousRequireVal;
        let previousNode;

        function shouldStartNewGroup(node, previousNode) {
            const lineOfNode = sourceCode.getFirstToken(node).loc.start.line;
            const lineOfPrev = sourceCode.getLastToken(previousNode).loc.start.line;
            return lineOfNode - lineOfPrev > 1;
        }

        return {
            VariableDeclaration(node) {
                const scope = context.getScope();

                if (scope.upper != null) {
                    // Not in the global scope, abort
                    return;
                }

                if (node.declarations.length > 1) {
                    // Multiple declarations in one declaration. Another rule
                    // will complain about this. abort!
                    return;
                }

                const declarator = node.declarations[0];

                if (declarator.init == null) {
                    // We're not setting this variable to anything, abort!
                    return;
                }

                const declaration = sourceCode.getText(declarator.init);

                const match = declaration.match(hasRequire);
                if (!match) {
                    // No require(), abort!
                    return;
                }

                const requireVal = match[1];

                if (previousRequireVal) {
                    if (shouldStartNewGroup(node, previousNode)) {
                        previousRequireVal = null;
                        previousNode = null;
                        return;
                    }

                    if (previousRequireVal > requireVal) {
                        context.report({
                            message: errorMessage,
                            node,
                        });
                    }
                }

                previousRequireVal = requireVal;
                previousNode = node;
            },

            LineComment(node) {
                const scope = context.getScope();

                if (scope.upper != null) {
                    // Not in the global scope, abort
                    return;
                }

                previousNode = node;
            },
            BlockComment(node) {
                const scope = context.getScope();

                if (scope.upper != null) {
                    // Not in the global scope, abort
                    return;
                }

                previousNode = node;
            },
        };
    },
    errorMessage,
};
