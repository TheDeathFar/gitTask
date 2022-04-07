module.exports = {
    root: true,
    env: {
        es6: true,
        browser: true,
        commonjs: true,
        jest: true
    },
    parser: `@typescript-eslint/parser`,
    parserOptions: {
        ecmaFeatures: {
            tsx: true,
            jsx: true
        },
        ecmaVersion: 2020,
    },
    plugins: [
        `@typescript-eslint`,
        `react`,
    ],
    extends: [
        `eslint:recommended`,
        `plugin:@typescript-eslint/recommended`,
        `plugin:react-hooks/recommended`,
        `plugin:react/recommended`,
    ],
    rules: {
        "no-console": `off`,
        "no-trailing-spaces": `off`,
        "no-case-declarations": `off`,
        "react-hooks/exhaustive-deps": `error`,
        "quotes": [`error`, `backtick`],
        "semi": [`error`, `always`],
        "react/prop-types": `off`,
        "@typescript-eslint/no-var-requires": `off`,
        "@typescript-eslint/no-empty-function": `off`,
        "@typescript-eslint/no-empty-interface": `off`,
        "@typescript-eslint/ban-ts-comment": `off`,
    }
};
