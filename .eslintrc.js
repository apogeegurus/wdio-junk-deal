module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
    },
    extends: ['google', 'prettier'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'require-jsdoc': ['off'],
        'no-invalid-this': ['off'],
    },
};
