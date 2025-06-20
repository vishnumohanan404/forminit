module.exports = {
  root: true,
  extends: ["eslint:recommended", "prettier"],
  plugins: ["prettier", "unused-imports"],
  rules: {
    "prettier/prettier": "error",
    "no-console": ["error", { allow: ["error"] }],
    "unused-imports/no-unused-imports": "error",
  },
  ignorePatterns: ["dist", "node_modules"],
};
