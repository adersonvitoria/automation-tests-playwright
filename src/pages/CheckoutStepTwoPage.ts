import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class CheckoutStepTwoPage extends BasePage {
  private readonly title = this.page.locator('.title');
  private readonly cartItems = this.page.locator('.cart_item');
  private readonly subtotalLabel = this.page.locator('.summary_subtotal_label');
  private readonly taxLabel = this.page.locator('.summary_tax_label');
  private readonly totalLabel = this.page.locator('.summary_total_label');
  private readonly finishButton = this.page.locator('[data-test="finish"]');
  private readonly cancelButton = this.page.locator('[data-test="cancel"]');

  constructor(page: Page) {
    super(page);
  }

  async isOverviewDisplayed(): Promise<boolean> {
    return this.isVisible(this.title);
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getSubtotal(): Promise<string> {
    return this.getText(this.subtotalLabel);
  }

  async getTax(): Promise<string> {
    return this.getText(this.taxLabel);
  }

  async getTotal(): Promise<string> {
    return this.getText(this.totalLabel);
  }

  async finishCheckout(): Promise<void> {
    await this.click(this.finishButton);
  }

  async cancelCheckout(): Promise<void> {
    await this.click(this.cancelButton);
  }
}
