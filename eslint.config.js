import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslint from "typescript-eslint";

export default [
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    ignores: ["src/modules/**", "dist/**"],
  },
  {
    languageOptions: { globals: globals.browser },
    rules: { "no-undef": "off", "@typescript-eslint/no-explicit-any": "off" },
  },
];
