// const fs = require('fs');
// const chalk = require('chalk');
const typescriptTransform = require('i18next-scanner-typescript');

module.exports = {
  input: [
    'src/**/*.{ts,tsx}',
    // Use ! to filter out files or directories
    '!src/**/*.spec.{ts,tsx}',
    '!src/i18n/**',
    '!**/node_modules/**',
  ],
  output: './public/',
  options: {
    debug: false,
    removeUnusedKeys: true,
    browserLanguageDetection: true,
    func: {
      list: ['i18next.t', 'i18n.t', 't'],
      extensions: ['.ts', '.tsx'],
    },
    trans: {
      extensions: ['.ts', '.tsx'],
      fallbackKey: function (ns, value) {
        return value;
      },
    },
    lngs: ['en', 'zh'],
    ns: ['translation'],
    defaultLng: 'en',
    defaultNs: 'translation',
    defaultValue: '__STRING_NOT_TRANSLATED__',
    resource: {
      loadPath: './public/locales/{{lng}}/{{ns}}.json',
      savePath: 'locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    nsSeparator: false, // namespace separator
    keySeparator: false, // key separator
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
  transform: typescriptTransform({ extensions: ['.tsx'] }),
};
