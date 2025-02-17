import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {languageOptions: { globals: globals.browser }},
  eslintConfigPrettier,
  pluginJs.configs.recommended,
  {
    rules: {
        "no-unused-vars": "warn",
        "no-undef": "warn",
        "no-unused-expressions": "warn",
        "semi": "warn"
    },
  },
  {
    ignores: ["**/temp.js", "config/*", ".config/*", "package.json", "webpack.config.js"]
  }
  
];
