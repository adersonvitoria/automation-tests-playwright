import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly title = this.page.locator('.title');
  private readonly inventoryItems = this.page.locator('.inventory_item');
  private readonly cartBadge = this.page.locator('.shopping_cart_badge');
  private readonly cartLink = this.page.locator('.shopping_cart_link');
  private readonly burgerMenu = this.page.locator('#react-burger-menu-btn');
  private readonly logoutLink = this.page.locator('#logout_sidebar_link');

  constructor(page: Page) {
    super(page);
  }

  async getPageTitle(): Promise<string> {
    return this.getText(this.title);
  }

  async isInventoryDisplayed(): Promise<boolean> {
    return this.isVisible(this.title);
  }

  async getProductCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async addProductToCartByIndex(index: number): Promise<void> {
    const addButton = this.inventoryItems.nth(index).locator('button');
    await this.click(addButton);
  }

  async addMultipleProductsToCart(count: number): Promise<void> {
    const total = await this.getProductCount();
    const toAdd = Math.min(count, total);
    for (let i = 0; i < toAdd; i++) {
      await this.addProductToCartByIndex(i);
    }
  }

  async getCartItemCount(): Promise<number> {
    const isVisible = await this.isVisible(this.cartBadge, 2000);
    if (!isVisible) return 0;
    const text = await this.getText(this.cartBadge);
    return parseInt(text, 10) || 0;
  }

  async goToCart(): Promise<void> {
    await this.click(this.cartLink);
  }

  async getProductName(index: number): Promise<string> {
    const nameLocator = this.inventoryItems.nth(index).locator('.inventory_item_name');
    return this.getText(nameLocator);
  }

  async getProductPrice(index: number): Promise<string> {
    const priceLocator = this.inventoryItems.nth(index).locator('.inventory_item_price');
    return this.getText(priceLocator);
  }

  async logout(): Promise<void> {
    await this.click(this.burgerMenu);
    await this.click(this.logoutLink);
  }
}
