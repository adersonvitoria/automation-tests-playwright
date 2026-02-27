import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class CheckoutStepOnePage extends BasePage {
  private readonly firstNameInput = this.page.locator('[data-test="firstName"]');
  private readonly lastNameInput = this.page.locator('[data-test="lastName"]');
  private readonly postalCodeInput = this.page.locator('[data-test="postalCode"]');
  private readonly continueButton = this.page.locator('[data-test="continue"]');
  private readonly cancelButton = this.page.locator('[data-test="cancel"]');
  private readonly errorMessage = this.page.locator('[data-test="error"]');

  constructor(page: Page) {
    super(page);
  }

  async fillForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
    if (firstName) await this.fill(this.firstNameInput, firstName);
    if (lastName) await this.fill(this.lastNameInput, lastName);
    if (postalCode) await this.fill(this.postalCodeInput, postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.click(this.continueButton);
  }

  async clickCancel(): Promise<void> {
    await this.click(this.cancelButton);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  async isErrorDisplayed(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }

  async isFormDisplayed(): Promise<boolean> {
    return this.isVisible(this.firstNameInput);
  }
}
