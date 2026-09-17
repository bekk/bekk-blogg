import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

/** @type {import('eslint').Linter.Config[]} */
const config = [...nextCoreWebVitals, { ignores: ['.next/**', 'node_modules/**'] }]

export default config
