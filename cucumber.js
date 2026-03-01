const commonConfig = {
  requireModule: ['tsx'],
  require: [
    'src/support/**/*.ts',
    'tests/e2e/steps/**/*.ts',
  ],
  paths: ['tests/e2e/features/**/*.feature'],
  formatOptions: {
    snippetInterface: 'async-await',
  },
  publishQuiet: true,
};

module.exports = {
  default: {
    ...commonConfig,
    format: [
      'progress',
      'summary',
      'json:reports/cucumber/results.json',
      'html:reports/cucumber/report.html',
    ],
  },
  allure: {
    ...commonConfig,
    formatOptions: {
      ...commonConfig.formatOptions,
      resultsDir: './allure-results',
    },
    format: [
      'allure-cucumberjs/reporter',
      'json:reports/cucumber/results.json',
      'html:reports/cucumber/report.html',
    ],
  },
};
