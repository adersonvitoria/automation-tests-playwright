const report = require('multiple-cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

const jsonDir = path.resolve('reports', 'cucumber');
const jsonFile = path.join(jsonDir, 'results.json');

if (!fs.existsSync(jsonFile)) {
  console.error('Arquivo de resultados não encontrado:', jsonFile);
  console.error('Execute os testes E2E primeiro: npm run test:e2e');
  process.exit(1);
}

report.generate({
  jsonDir: jsonDir,
  reportPath: path.resolve('reports', 'cucumber', 'html-report'),
  reportName: 'Relatório de Testes E2E',
  pageTitle: 'Automation Tests - E2E Report',
  displayDuration: true,
  displayReportTime: true,
  metadata: {
    browser: { name: 'chromium', version: 'latest' },
    device: 'Desktop',
    platform: { name: process.platform, version: process.version },
  },
  customData: {
    title: 'Informações do Projeto',
    data: [
      { label: 'Projeto', value: 'Automation Tests - Playwright + Cucumber' },
      { label: 'Framework', value: 'Playwright + Cucumber BDD' },
      { label: 'Aplicação Alvo', value: 'SauceDemo (https://www.saucedemo.com)' },
      { label: 'Execução', value: new Date().toLocaleString('pt-BR') },
    ],
  },
});

console.log('Relatório HTML gerado com sucesso em: reports/cucumber/html-report/');
