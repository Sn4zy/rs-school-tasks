import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactPlugin from 'eslint-plugin-react'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import tseslint from 'typescript-eslint'
import vitestPlugin from 'eslint-plugin-vitest'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage', '.next', 'next-env.d.ts', 'src/setupTests.ts', 'src/tests/**', 'vitest.config.ts']),
  nextPlugin.flatConfig.coreWebVitals,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat['jsx-runtime'],
      eslintConfigPrettier,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.{test,spec}.{ts,tsx}'],
    plugins: { vitest: vitestPlugin },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...vitestPlugin.environments.env.globals,
      },
    },
  },
])
