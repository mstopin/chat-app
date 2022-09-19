module.exports = {
  extends: [`${__dirname}/../../.eslintrc.js`, 'plugin:react/recommended'],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: 'current',
    },
  },
};
