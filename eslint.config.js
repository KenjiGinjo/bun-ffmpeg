import { ESLINT } from "codestilo";
import globals from "globals";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  ...ESLINT.ts,
];
