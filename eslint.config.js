const antfu = require('@antfu/eslint-config')

module.exports = antfu.default({
  rules: {
    'no-console': 'off',
    'antfu/if-newline': 'off',
  },
})
