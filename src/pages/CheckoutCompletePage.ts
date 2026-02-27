import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  private readonly title = this.page.locator('.title');
  private readonly completeHeader = this.page.locator('.complete-header');
  private readonly completeText = this.page.locator('.complete-text');
  private readonly backHomeButton = this.page.locator('[data-test="back-to-products"]');

  constructor(page: Page) {
    super(page);
  }

  async isCompleteDisplayed(): Promise<boolean> {
    return this.isVisible(this.completeHeader);
  }

  async getConfirmationHeader(): Promise<string> {
    return this.getText(this.completeHeader);
  }

  async getConfirmationText(): Promise<string> {
    return this.getText(this.completeText);
  }

  async backToHome(): Promise<void> {
    await this.click(this.backHomeButton);
  }
}
