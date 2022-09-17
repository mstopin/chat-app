module.exports = {
  extends: [`${__dirname}/../../.eslintrc.js`, 'plugin:react/recommended'],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  settings: {
    react: {
      version: 'current',
    },
  },
};
