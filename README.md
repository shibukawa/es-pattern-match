# ECMAScript AST pattern match: es-pattern-match

es-pattern-match makes you happy to play with AST of ECMAScript code.
It helps you to find AST nodes by using regular ECMAScript code fragments.
You don't have to traverse deep AST tree structure by yourself anymore.

## Demo

```js
const StatementPattern = require('es-pattern-match').StatementPattern;

// patterns is a dictionary of pattern codes.
// Its name (the following code uses 'array') is stored in result.
const pattern = new StatementPattern({
    array: `[1, 2, 3, 4, 5]`
});

// match() method checks code AST and returns result
// src text is just JS code
const src = `
    const a = [1, 2, 3, 4, 5];
`;

const results = pattern.match(src);
/*
   results = [
       {
           name: 'array',          // pattern name
           stack: [acorn.Node...], // matched 
           node: acorn.Node
       }
   ];
*/
```

## Requirement

* acorn

## Reference

### class StatementPattern;

#### constructor(patterns : Map.<string, string>, acornOption : Object)

Analyze patterns' AST and cache.

#### match(src : string) : {name: string|acorn.Node|acorn.Node[], node: acorn.Node, stack: acorn.Node[]}[]

Analyze src AST and find matched part in src with patterns.

### patternMatch(src : string|acorn.Node|acorn.Node[], patterns : Map.<string, string>, acornOption : Object) : {name: string, node: acorn.Node, stack: acorn.Node[]}[]

It is a shortcut function to call StatementPattern#match.

## Wildcard Reference

### __decr__

It matches with ``var``, ``const``, ``let``.

```js
const result = patternMatch(`const v = 'string'`, {
    'string-variable-declearation': `__decr__ v = __string__`
});
```

### __any__

It matches with any node.

```js
const result = patternMatch(`const v = 'string'`, {
    'string-variable-declearation': `__decr__ v = __string__`
});
```

### __anybody__

It matches with expressions in function body.

```js
const result = patternMatch(`
    (function () {
        console.log("hello world");
    })();`, {
    'immediate-function: `(function () {
        __anybody__;
    })`
});

### __anyname__

It matches with any identifier.

```js
const result = patternMatch(`const v = 'string'`, {
    'string-variable-declearation': `const __anyname__ = 'string'`
});
```

### __number__

```js
const result = patternMatch(`var v = 12345`, {
    'string-variable-declearation': `var v = __number__`
});
```

### __string__

```js
const result = patternMatch(`let v = 'string'`, {
    'string-variable-declearation': `let v = __string__`
});
```

### __boolean__

It matches with true/false

```js
const result = patternMatch(`const v = true`, {
    'string-variable-declearation': `const v = __boolean__`
});
```

### __extra__

It matches with extra function arguments or extra elements of Array

```js
const result = patternMatch(`function(1, 2, 3, 4, 'debug-flag');`, {
    'array': `function(1, 2, 3, 4, __extra);`
});
```

```js
const result = patternMatch(`const v = [1, 2, 3, 4, 5];`, {
    'array': `[1, 2, 3, __extra__]`
});
```

## Install

$ npm install es-pattern-match

## Licence

(MIT)[https://shibu.mit-license.org/]

## Author

Yoshiki Shibukawa
