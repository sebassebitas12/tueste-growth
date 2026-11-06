import globals from "globals";
import js from "@eslint/js";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "data/**",
      ".npm-cache/**",
      ".git/**",
    ],
  },
  {
    files: ["**/*.{js,jsx}"],
    ...js.configs.recommended,
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, "react-hooks": hooks },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...hooks.configs.recommended.rules,
      "react/prop-types": "off",
    },
  },
]);
