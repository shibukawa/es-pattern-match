'use strict';

const assert = require('power-assert');
const StatementPattern = require('../index').StatementPattern;
const patternMatch = require('../index').patternMatch;

describe('matching with variables', () => {
    it('can match value assignment with variable declearation', () => {
        const src = `
        var a = 10;
        var a = 20;
        var b = 10;
        `;

        const pattern = {
            assign: `var a = 10;`
        };

        const result = patternMatch(src, pattern);
        assert(result.length === 1);
        assert(result[0].name === 'assign');
        assert(result[0].node.type === 'VariableDeclaration');
    });

    it('can match with assignment', () => {
        const src = `
        var a = 10;
        var b;
        var c = 20;
        var d = 'string';
        `;

        const pattern = {
            assign: `a = 10;`
        };

        const result = patternMatch(src, pattern);
        assert(result.length === 1);
        assert(result[0].node.type === 'VariableDeclarator');
    });

    it('can match any value assignment by using __any__', () => {
        const src = `
        var a = 10;
        var a = 20;
        var b = 10;
        `;

        const pattern = {
            assign: `var a = __any__;`
        };

        const result = patternMatch(src, pattern);
        assert(result.length === 2);
        assert(result[0].node.type === 'VariableDeclaration');
        assert(result[1].node.type === 'VariableDeclaration');
    });

    it('can match any number assignment by using __number__', () => {
        const src = `
        var a = 10;
        var a = 'string';
        var a = 20;
        var a = true;
        `;

        const pattern = {
            assign: `var a = __number__;`
        };

        const result = patternMatch(src, pattern);
        assert(result.length === 2);
        assert(result[0].node.type === 'VariableDeclaration');
        assert(result[1].node.type === 'VariableDeclaration');
    });

    it('can match any string assignment by using __string__', () => {
        const src = `
        var a = 10;
        var a = 'string';
        var a = 20;
        var a = true;
        `;

        const pattern = {
            assign: `var a = __string__;`
        };

        const result = patternMatch(src, pattern);
        assert(result.length === 1);
        assert(result[0].node.type === 'VariableDeclaration');
    });

    it('can match any boolean assignment by using __boolean__', () => {
        const src = `
        var a = 10;
        var a = 'string';
        var a = 20;
        var a = true;
        `;

        const pattern = {
            assign: `var a = __boolean__;`
        };

        const result = patternMatch(src, pattern);
        assert(result.length === 1);
        assert(result[0].node.type === 'VariableDeclaration');
    });

    it('can match any assignment by using __anyname__', () => {
        const src = `
        var a = 10;
        var b = true;
        var c = 20;
        var d = 'string';
        `;

        const pattern = {
            assign: `var __anyname__ = __number__;`
        };

        const result = patternMatch(src, pattern);
        assert(result.length === 2);
        assert(result[0].node.type === 'VariableDeclaration');
        assert(result[1].node.type === 'VariableDeclaration');
    });

    it('can match any kind of assignment by using __decr__', () => {
        const src = `
        var a = 10;
        const a = 15;
        let a = 20;
        `;

        const pattern = {
            assign: `__decr__ a = __number__;`
        };

        const result = patternMatch(src, pattern);
        assert(result.length === 3);
        assert(result[0].node.type === 'VariableDeclaration');
        assert(result[0].node.kind === 'var');
        assert(result[0].name == 'assign');
        assert(result[1].node.type === 'VariableDeclaration');
        assert(result[1].node.kind === 'const');
        assert(result[1].name == 'assign');
        assert(result[2].node.type === 'VariableDeclaration');
        assert(result[2].node.kind === 'let');
        assert(result[2].name == 'assign');
    });
});


describe('matching with Array', () => {
    it('can match with array', () => {
        const src = `
        var array = [1, 2, 3, 4, 5];
        `;

        const pattern = {
            array: `[1, 2, 3, 4, 5]`
        };

        const result = patternMatch(src, pattern);
        assert(result.length === 1);
    });

    it('can match with extra value (same length)', () => {
        const src = `
        var array = [1, 2, 3, 4, 5];
        `;

        const pattern = {
            array: `[1, 2, 3, 4, __extra__]`
        };

        const result = patternMatch(src, pattern);
        assert(result.length === 1);
    });

    it('can match with extra values (src Array is longer)', () => {
        const src = `
        var array = [1, 2, 3, 4, 5];
        `;

        const pattern = {
            array: `[1, 2, __extra__]`
        };

        const result = patternMatch(src, pattern);
        assert(result.length === 1);
    });

    it('can match with extra values (src Array is shorter)', () => {
        const src = `
        var array = [1, 2];
        `;

        const pattern = {
            array: `[1, 2, __extra__]`
        };

        const result = patternMatch(src, pattern);
        assert(result.length === 1);
    });
});

describe('matching with function call', () => {
    it('can match function call', () => {
        const src = `
        const result = func(123, "abc");
        `;

        const pattern = {
            call: `const result = func(123, "abc")`
        };
        const result = patternMatch(src, pattern);
        assert(result.length === 1);
    });

    it('can match extra arguments with __extra__', () => {
        const src = `
        const result = func(123, "abc", true);
        `;

        const pattern = {
            call: `const result = func(123, "abc", __extra__)`
        };
        const result = patternMatch(src, pattern);
        assert(result.length === 1);
    });

    it('can match more than two extra arguments with __extra__', () => {
        const src = `
        const result = func(123, "abc", true, false, null);
        `;

        const pattern = {
            call: `const result = func(123, "abc", __extra__)`
        };
        const result = patternMatch(src, pattern);
        assert(result.length === 1);
    });
});

describe('matching with body', () => {
    it('can match single body and __anybody__', () => {
        const src = `
        function a() {
            console.log("inside a");
        }

        function b() {
            console.log("inside b");
        }
        `;

        const pattern = {
            func: `function __anyname__() { __anybody__; }`
        };
        const result = patternMatch(src, pattern);
        assert(result.length === 2);
    });

    it('can match empty body and __anybody__', () => {
        const src = `
        function a() {
        }

        function b() {
        }
        `;

        const pattern = {
            func: `function __anyname__() { __anybody__; }`
        };
        const result = patternMatch(src, pattern);
        assert(result.length === 2);
    });

    it('can match multiline bodies and __anybody__', () => {
        const src = `
        function a() {
            console.log("inside a");
            console.log("inside a");
        }

        function b() {
            console.log("inside b");
            console.log("inside b");
        }
        `;

        const pattern = {
            func: `function __anyname__() { __anybody__; }`
        };
        const result = patternMatch(src, pattern);
        assert(result.length === 2);
    });
});

describe('nested search', () => {
    it('can search resulting node again', () => {
        const src = `
        (function b() {
            function a() {
                const i18n = require('i18n4v');

                console.log(i18n('translation'));
            }
        })();
        console.log(i18n('dummy1'));
        console.log(i18n('dummy2'));
        `
        const pattern1 = {
            i18n: `__decr__ __anyname__ = require('i18n4v');`
        };
        const result1 = patternMatch(src, pattern1);

        assert(result1.length === 1);
        assert(result1[0].stack.length === 6);

        // console.log(JSON.stringify(result1[0].node, null, 4));
        const varName = result1[0].node.declarations[0].id.name;
        const pattern2 = {
            usei18n: varName + '(__string__)'
        }
        // search from function body block that defines i18n variable
        const result2 = patternMatch(result1[0].stack.slice(-1), pattern2);
        assert(result2.length === 1);
    });
});

describe('StatementPattern class', () => {
    it('can match value assignment', () => {
        const src = `
        var a = 10;
        var a = 20;
        var b = 10;
        `;

        const pattern = new StatementPattern({
            assign: `var a = 10;`
        });

        const result = pattern.match(src);
        assert(result.length === 1);
        assert(result[0].name === 'assign');
        assert(result[0].node.type === 'VariableDeclaration');
    });
});
