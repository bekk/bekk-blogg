import studio from '@sanity/eslint-config-studio'

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...studio,
  {ignores: ['dist/**', 'node_modules/**', '../web/**']},
  {
    // Migrasjonsskriptene kjøres av Node, ikke i nettleseren.
    files: ['migrations/**/*.js'],
    languageOptions: {globals: {console: 'readonly', process: 'readonly'}},
  },
]

export default config
