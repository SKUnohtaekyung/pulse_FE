module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["react", "react-hooks"],
  extends: ["eslint:recommended", "plugin:react/recommended"],
  ignorePatterns: [
    "dist/",
    "node_modules/",
    "src/unused_backup/",
    "test.jsx",
    "vite.err.log",
    "vite.out.log",
  ],
  rules: {
    "no-constant-condition": ["error", { checkLoops: false }],
    "no-unused-vars": "off",
    "react/no-unescaped-entities": "off",
    "react/no-unknown-property": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/exhaustive-deps": "off",
    "react-hooks/rules-of-hooks": "error",
  },
};
