import { test as baseTest } from '@playwright/test';

import { AdvancedPayment } from '../models/advanced-payment.ts';
import { SimplePayment } from '../models/simple-payment.ts';

// Extend the test context to include page objects
type ModelFixtures = {
  simplePayment: SimplePayment;
  advancedPayment: AdvancedPayment;
};

const test = baseTest.extend<ModelFixtures>({
  simplePayment: async ({ page }, use) => {
    const simplePayment = new SimplePayment(page);

    await use(simplePayment);
  },
  advancedPayment: async ({ page }, use) => {
    const advancedPayment = new AdvancedPayment(page);
    await use(advancedPayment);
  },
});

export * from '@playwright/test';

export { test };
