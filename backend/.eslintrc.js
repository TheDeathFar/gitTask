module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    `eslint:recommended`,
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "no-console": `off`,
    "no-trailing-spaces": `off`,
    "no-case-declarations": `off`,
    "quotes": [`error`, `backtick`],
    "semi": [`error`, `always`],
    "@typescript-eslint/no-var-requires": `off`,
    "@typescript-eslint/no-empty-function": `off`,
    "@typescript-eslint/no-empty-interface": `off`,
    "@typescript-eslint/ban-ts-comment": `off`,
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
