import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly title = this.page.locator('.title');
  private readonly cartItems = this.page.locator('.cart_item');
  private readonly checkoutButton = this.page.locator('[data-test="checkout"]');
  private readonly continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');

  constructor(page: Page) {
    super(page);
  }

  async isCartDisplayed(): Promise<boolean> {
    return this.isVisible(this.title);
  }

  async getCartTitle(): Promise<string> {
    return this.getText(this.title);
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getItemName(index: number): Promise<string> {
    const nameLocator = this.cartItems.nth(index).locator('.inventory_item_name');
    return this.getText(nameLocator);
  }

  async getItemPrice(index: number): Promise<string> {
    const priceLocator = this.cartItems.nth(index).locator('.inventory_item_price');
    return this.getText(priceLocator);
  }

  async removeItem(index: number): Promise<void> {
    const removeButton = this.cartItems.nth(index).locator('button');
    await this.click(removeButton);
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }

  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
  }
}
