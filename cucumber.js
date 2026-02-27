module.exports = {
  default: {
    requireModule: ['tsx'],
    require: [
      'src/support/**/*.ts',
      'tests/e2e/steps/**/*.ts',
    ],
    paths: ['tests/e2e/features/**/*.feature'],
    format: [
      'progress-bar',
      'json:reports/cucumber/results.json',
      'html:reports/cucumber/report.html',
    ],
    formatOptions: {
      snippetInterface: 'async-await',
    },
    publishQuiet: true,
  },
};
