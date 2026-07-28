import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  {
    // §05 — "Do not invent tokens... the absences are load-bearing."
    // These rules make the frozen absences enforceable rather than advisory:
    // no literal colours, no ad-hoc font sizes, no shadows, no elevation.
    files: ['app/**/*.tsx', 'components/**/*.tsx', 'features/**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "JSXAttribute[name.name='className'] > Literal[value=/(^|[^-\\w])(shadow|drop-shadow|bg-gradient|bg-\\[#|text-\\[#|border-\\[#|opacity-)/]",
          message:
            'Frozen design system: no shadows, gradients, opacity or literal hex. Bind to a semantic token (§05).',
        },
        {
          selector:
            "JSXAttribute[name.name='className'] > Literal[value=/(^|\\s)text-(xs|sm|base|lg|xl|[2-9]xl)(\\s|$)/]",
          message:
            'Frozen design system: use one of the seven type roles, not an ad-hoc font size (§05).',
        },
        {
          selector: "JSXAttribute[name.name='style']",
          message: 'No inline styles. Use tokens and utility classes.',
        },
      ],
    },
  },
];

export default eslintConfig;
