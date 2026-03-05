import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../../src/support/world';

Given('que estou na página de login', async function (this: CustomWorld) {
  await this.loginPage.open();
  const isDisplayed = await this.loginPage.isLoginPageDisplayed();
  expect(isDisplayed).toBeTruthy();
});

When(
  'eu preencho o usuário {string} e a senha {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await this.loginPage.enterUsername(username);
    if (password !== '') {
      await this.loginPage.enterPassword(password);
    }
  }
);

When('clico no botão de login', async function (this: CustomWorld) {
  await this.loginPage.clickLogin();
});

Then(
  'devo ser redirecionado para a página de inventário',
  async function (this: CustomWorld) {
    await this.page.waitForURL('**/inventory.html', { timeout: 10_000 });
    const url = await this.inventoryPage.getCurrentUrl();
    expect(url).toContain('inventory');
  }
);

Then('devo visualizar a lista de produtos', async function (this: CustomWorld) {
  const isDisplayed = await this.inventoryPage.isInventoryDisplayed();
  expect(isDisplayed).toBeTruthy();

  const count = await this.inventoryPage.getProductCount();
  expect(count).toBeGreaterThan(0);
});

Then(
  'devo ver a mensagem de erro {string}',
  async function (this: CustomWorld, expectedMessage: string) {
    const isErrorVisible = await this.loginPage.isErrorDisplayed();
    expect(isErrorVisible).toBeTruthy();

    const errorText = await this.loginPage.getErrorMessage();
    expect(errorText).toContain(expectedMessage);
  }
);

Then('a URL deve conter {string}', async function (this: CustomWorld, urlPart: string) {
  const currentUrl = await this.page.url();
  expect(currentUrl).toContain(urlPart);
});

Then(
  'o título da página de inventário deve ser {string}',
  async function (this: CustomWorld, expectedTitle: string) {
    const title = await this.inventoryPage.getPageTitle();
    expect(title).toBe(expectedTitle);
  }
);
