module.exports = {
  root: false,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["react", "react-hooks", "jsx-a11y", "@typescript-eslint", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  rules: {
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off", // Not needed with React 17+
    "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
