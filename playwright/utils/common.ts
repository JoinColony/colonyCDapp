import { expect, type BrowserContext, type Page } from '@playwright/test';

export const acceptCookieConsentBanner = async (page: Page) => {
  // Check if the cookie banner is present on the page
  const cookieBanner = page.locator('#ez-cookie-notification');
  const isBannerVisible = await cookieBanner.isVisible();

  if (isBannerVisible) {
    // Click the accept button on the cookie banner
    const acceptButton = page.locator('#ez-cookie-notification__accept');

    await acceptButton.click();
  }
};

const cookieNames = [
  'cookies-analytics',
  'cookies-marketing',
  'cookies-preferences',
  'cookies-functional',
];

export const setCookieConsent = async (
  context: BrowserContext,
  baseUrl: string = '',
) => {
  await context.addCookies(
    cookieNames.map((cookie) => ({
      name: cookie,
      value: 'true',
      url: baseUrl,
      expires: Date.now() / 1000 + 60 * 60 * 24 * 365,
    })),
  );
};

export const fillInputWithDelay = async ({
  page,
  label,
  selector,
  value,
  // timeout = 500,
}: {
  page: Page;
  label?: string | RegExp;
  selector?: string;
  value: string;
  timeout?: number;
}) => {
  if (!label && !selector) {
    throw new Error('You must provide either a label or a selector');
  }
  const input = label ? page.getByLabel(label) : page.locator(selector!);

  // await page.waitForTimeout(timeout);
  await input.fill(value);
  await expect(input).toHaveValue(value);
};

export const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

export const generateRandomEmail = () => {
  return `${generateRandomString()}@example.com`;
};

const customTimeout = parseInt(process.env.E2E_TIMEOUT || '2000', 10); // Allow to run with different timeout, defaults to 2000ms

export const selectWallet = async (
  page: Page,
  wallet: string | RegExp = /dev wallet 2/i,
) => {
  await page
    .getByRole('button', { name: /connect wallet/i })
    .first()
    .click();

  await page.getByLabel(/I agree to/i).click();

  await page.getByText(wallet).click();

  await page.getByText(/Local Ganache Instance/i).waitFor({ state: 'visible' });

  const loadingIndicator = page.getByText(/Checking your access.../i);
  const loadingIndicatorVisible = await loadingIndicator.isVisible();

  if (loadingIndicatorVisible) {
    await loadingIndicator.waitFor({ state: 'hidden' });
  }
  // Using waitForTimeout as a temporary workaround,
  // to ensure all input fields and buttons are fully interactive.
  // Otherwise tests might randomply fail
  // due to elements not being fully ready for actions.
  // Look for a better signal to wait for.
  // eslint-disable-next-line playwright/no-wait-for-timeout
  await page.waitForTimeout(customTimeout);
};
