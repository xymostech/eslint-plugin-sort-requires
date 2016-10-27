# eslint-plugin-sort-requires

ESLint rule to enforce sorting of variable declarations in a group of `require()` calls

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm install eslint --save-dev
```

Next, install `eslint-plugin-sort-requires`:

```
$ npm install eslint-plugin-sort-requires@xymostech/eslint-plugin-sort-requires --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must
also install `eslint-plugin-sort-requires` globally.

## Usage

Add `sort-requires` to the plugins section of your `.eslintrc` configuration
file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "sort-requires"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "sort-requires/sort-requires": 2
    }
}
```

## sort-requires

Enforce alphabetically sorting of variable declarations in a group of
`require()` calls. A group is a section of code where there are no blank lines
between the end of one variable declaration node with a `require()` call the
beginning of the next.

This enforces that the value inside the require filename is sorted, not the
variable or pattern that it is assigned to.

#### Good
```js
var {z} = require('a');
var c = require('c');

var a = require('a');
```

#### Bad
```js
var b = require('b');
var a = require('a');

var {a} =
  require('d');
var c = require('c');
```

See [tests/lib/rules/sort-requires.js](tests/lib/rules/sort-requires.js) for
more cases.

## License

[MIT](LICENSE.txt)
