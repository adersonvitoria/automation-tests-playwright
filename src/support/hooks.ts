import { Before, After, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import * as fs from 'fs';
import * as path from 'path';

const screenshotDir = path.resolve('reports', 'screenshots');

Before(async function (this: CustomWorld) {
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  await this.init();
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const scenarioName = scenario.pickle.name.replace(/\s+/g, '_').substring(0, 50);
    const screenshotPath = path.join(screenshotDir, `${scenarioName}_${timestamp}.png`);

    const screenshot = await this.page.screenshot({ fullPage: true });
    fs.writeFileSync(screenshotPath, screenshot);

    this.attach(screenshot, 'image/png');
  }

  await this.cleanup();
});
