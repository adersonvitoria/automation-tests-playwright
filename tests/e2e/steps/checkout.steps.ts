import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../../src/support/world';

Given(
  'que estou logado com usuário {string} e senha {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await this.loginPage.open();
    await this.loginPage.login(username, password);
    await this.page.waitForURL('**/inventory.html', { timeout: 10_000 });
  }
);

When('eu adiciono o primeiro produto ao carrinho', async function (this: CustomWorld) {
  await this.inventoryPage.addProductToCartByIndex(0);
});

When(
  'eu adiciono {int} produtos ao carrinho',
  async function (this: CustomWorld, count: number) {
    await this.inventoryPage.addMultipleProductsToCart(count);
  }
);

When('navego até o carrinho', async function (this: CustomWorld) {
  await this.inventoryPage.goToCart();
  await this.page.waitForURL('**/cart.html', { timeout: 10_000 });
});

Then(
  'devo ver {int} item(s) no carrinho',
  async function (this: CustomWorld, expectedCount: number) {
    const itemCount = await this.cartPage.getItemCount();
    expect(itemCount).toBe(expectedCount);
  }
);

Then(
  'devo ver {int} itens no carrinho',
  async function (this: CustomWorld, expectedCount: number) {
    const itemCount = await this.cartPage.getItemCount();
    expect(itemCount).toBe(expectedCount);
  }
);

When('prossigo para o checkout', async function (this: CustomWorld) {
  await this.cartPage.proceedToCheckout();
  await this.page.waitForURL('**/checkout-step-one.html', { timeout: 10_000 });
});

When(
  'preencho o formulário com nome {string}, sobrenome {string} e CEP {string}',
  async function (this: CustomWorld, firstName: string, lastName: string, postalCode: string) {
    await this.checkoutStepOnePage.fillForm(firstName, lastName, postalCode);
  }
);

When('continuo para a revisão do pedido', async function (this: CustomWorld) {
  await this.checkoutStepOnePage.clickContinue();
});

Then('devo ver o resumo do pedido', async function (this: CustomWorld) {
  await this.page.waitForURL('**/checkout-step-two.html', { timeout: 10_000 });
  const isDisplayed = await this.checkoutStepTwoPage.isOverviewDisplayed();
  expect(isDisplayed).toBeTruthy();
});

Then(
  'devo ver o resumo do pedido com {int} itens',
  async function (this: CustomWorld, expectedCount: number) {
    await this.page.waitForURL('**/checkout-step-two.html', { timeout: 10_000 });
    const itemCount = await this.checkoutStepTwoPage.getItemCount();
    expect(itemCount).toBe(expectedCount);
  }
);

When('finalizo a compra', async function (this: CustomWorld) {
  await this.checkoutStepTwoPage.finishCheckout();
  await this.page.waitForURL('**/checkout-complete.html', { timeout: 10_000 });
});

Then(
  'devo ver a mensagem de confirmação {string}',
  async function (this: CustomWorld, expectedMessage: string) {
    const isComplete = await this.checkoutCompletePage.isCompleteDisplayed();
    expect(isComplete).toBeTruthy();

    const header = await this.checkoutCompletePage.getConfirmationHeader();
    expect(header).toContain(expectedMessage);
  }
);

Then(
  'devo ver o erro de checkout {string}',
  async function (this: CustomWorld, expectedError: string) {
    const isErrorVisible = await this.checkoutStepOnePage.isErrorDisplayed();
    expect(isErrorVisible).toBeTruthy();

    const errorText = await this.checkoutStepOnePage.getErrorMessage();
    expect(errorText).toContain(expectedError);
  }
);

Then(
  'o resumo deve exibir subtotal, impostos e total',
  async function (this: CustomWorld) {
    await this.page.waitForURL('**/checkout-step-two.html', { timeout: 10_000 });

    const subtotal = await this.checkoutStepTwoPage.getSubtotal();
    expect(subtotal).toContain('Item total:');

    const tax = await this.checkoutStepTwoPage.getTax();
    expect(tax).toContain('Tax:');

    const total = await this.checkoutStepTwoPage.getTotal();
    expect(total).toContain('Total:');
  }
);
