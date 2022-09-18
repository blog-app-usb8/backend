module.exports = {
  'env': {
    'browser': true,
    'node': true,
    'commonjs': true,
    'es2021': true,
    'jest': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'rules': {
    'indent': [
      'error',
      2 // NOTE:
    ],
    // 'linebreak-style': [
    //   'error',
    //   // 'unix' // LF
    //   'windows' // CRLF
    // ],
    'linebreak-style': 0, // NOTE: avoid CRLF
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never' // NOTE: semicolon - option ALWAYS 
    ],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error', // NOTE:
    'object-curly-spacing': [
      'error', 'always'
    ],
    'arrow-spacing': [ // NOTE:
      'error', { 'before': true, 'after': true }
    ],
    'no-console': 0, // NOTE:
  },
}