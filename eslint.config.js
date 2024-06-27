import { ESLINT } from 'codestilo';
import globals from 'globals';
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        Bun: 'readonly',
      },
    },
  },
  ...ESLINT.ts,

  {
    files: ['src/**/*.ts'],
  },
];
