module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 8,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["error", "double"],
    "object-curly-spacing": ["off"],
    "no-unused-vars": ["off"],
    "indent": ["off"],
  },
};
