const rule = require('../../../lib').rules['sort-requires'];
const { RuleTester } = require('eslint');

const code = (lines) => lines.join('\n');
const expectedError = [{
    message: rule.errorMessage,
}];
const ruleTester = new RuleTester();

ruleTester.run('sort-requires', rule, {
    valid: [
        {
            // Requires are sorted
            code: code([
                'const a = require("a")',
                'const b = require("b")',
            ]),
            parserOptions: { ecmaVersion: 6 },
        },

        {
            // Requires in different blocks are independent.
            code: code([
                'const b = require("b")',
                '',
                'const a = require("a")',
            ]),
            parserOptions: { ecmaVersion: 6 },
        },

        {
            // Requires with comments between them are coupled.
            code: code([
                'const a = require("a")',
                '// boo',
                'const b = require("b")',
                '/* boo',
                ' */',
                'const c = require("c")',
            ]),
            parserOptions: { ecmaVersion: 6 },
        },

        {
            // Requires that are modified are still sorted
            code: code([
                'const a = require("a").blah',
                'const b = foo(require("b"))',
            ]),
            parserOptions: { ecmaVersion: 6 },
        },

        {
            // The value in the require() is what needs to be sorted, not the
            // value it is assigned to.
            code: code([
                'const b = require("a")',
                'const a = require("b")',
            ]),
            parserOptions: { ecmaVersion: 6 },
        },

        {
            // Same as ^ but with destructuring.
            code: code([
                'const {z} = require("a")',
                'const a = require("b")',
            ]),
            parserOptions: { ecmaVersion: 6 },
        },

        {
            // Multi-line destructuring works
            code: code([
                'const {',
                '  x,',
                '  z,',
                '} = require("a")',
                'const a = require("b")',
            ]),
            parserOptions: { ecmaVersion: 6 },
        },

        {
            // Requires that are offset from the variable declaration.
            code: code([
                'const a =',
                '  require("a")',
                'const b = require("b")',
            ]),
            parserOptions: { ecmaVersion: 6 },
        },

        {
            // Whitespace doesn't matter
            code: code([
                'const a = require("a")',
                'const b = require(    "b"  )',
            ]),
            parserOptions: { ecmaVersion: 6 },
        },

        {
            // Capitalization matters
            code: code([
                'const A = require("A")',
                'const a = require("a")',
            ]),
            parserOptions: { ecmaVersion: 6 },
        },

        {
            // Requires are ascii-sorted
            code: code([
                'const A = require("A")',
                'const _ = require("_")',
                'const a = require("a")',
            ]),
            parserOptions: { ecmaVersion: 6 },
        },

        {
            // Requires not at the file-level scope don't need to be sorted.
            code: code([
                'function a() {',
                '  const b = require("b")',
                '  const a = require("a")',
                '}',
            ]),
            parserOptions: { ecmaVersion: 6 },
        },

        {
            // Multiple declarations per statement are ignored.
            code: code([
                'const b = require("b"),',
                '  a = require("a")',
            ]),
            parserOptions: { ecmaVersion: 6 },
        },
    ],

    invalid: [
        {
            // Requires aren't sorted
            code: code([
                'const b = require("b")',
                'const a = require("a")',
            ]),
            parserOptions: { ecmaVersion: 6 },
            errors: expectedError,
        },

        {
            // Requires with comments between them are coupled.
            code: code([
                'const b = require("b")',
                '// boo',
                'const a = require("a")',
            ]),
            parserOptions: { ecmaVersion: 6 },
            errors: expectedError,
        },

        {
            // Requires with comments between them are coupled.
            code: code([
                'const b = require("b")',
                '/* boo',
                ' */',
                'const a = require("a")',
            ]),
            parserOptions: { ecmaVersion: 6 },
            errors: expectedError,
        },

        {
            // Requires that are modified are still sorted
            code: code([
                'const b = foo(require("b"))',
                'const a = require("a").blah',
            ]),
            parserOptions: { ecmaVersion: 6 },
            errors: expectedError,
        },

        {
            // The value in the require() is what needs to be sorted, not the
            // value it is assigned to.
            code: code([
                'const a = require("b")',
                'const b = require("a")',
            ]),
            parserOptions: { ecmaVersion: 6 },
            errors: expectedError,
        },

        {
            // Same as ^ but with destructuring.
            code: code([
                'const a = require("b")',
                'const {z} = require("a")',
            ]),
            parserOptions: { ecmaVersion: 6 },
            errors: expectedError,
        },

        {
            // Multi-line destructuring works
            code: code([
                'const a = require("b")',
                'const {',
                '  x,',
                '  z,',
                '} = require("a")',
            ]),
            parserOptions: { ecmaVersion: 6 },
            errors: expectedError,
        },

        {
            // Requires that are offset from the variable declaration.
            code: code([
                'const b = require("b")',
                'const a =',
                '  require("a")',
            ]),
            parserOptions: { ecmaVersion: 6 },
            errors: expectedError,
        },

        {
            // Whitespace doesn't matter
            code: code([
                'const b = require(',
                '  "b")',
                'const a = require("a")',
            ]),
            parserOptions: { ecmaVersion: 6 },
            errors: expectedError,
        },

        {
            // Whitespace doesn't matter
            code: code([
                'const b = require(    "b"  )',
                'const a = require("a")',
            ]),
            parserOptions: { ecmaVersion: 6 },
            errors: expectedError,
        },

        {
            // Capitalization matters
            code: code([
                'const a = require("a")',
                'const A = require("A")',
            ]),
            parserOptions: { ecmaVersion: 6 },
            errors: expectedError,
        },

        {
            // Requires are ascii-sorted
            code: code([
                'const A = require("A")',
                'const a = require("a")',
                'const _ = require("_")',
            ]),
            parserOptions: { ecmaVersion: 6 },
            errors: expectedError,
        },
    ],
});
