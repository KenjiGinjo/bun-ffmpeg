import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['docs/**'],
  rules: {
    '@typescript-eslint/no-non-null-asserted-optional-chain': 0,
  },
})
