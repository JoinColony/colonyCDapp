import { type BrowserContext, type Page } from '@playwright/test';

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
  'cookies-prefernces',
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

export const fillInputByLabelWithDelay = async ({
  page,
  label,
  value,
  timeout = 500,
}: {
  page: Page;
  label: string | RegExp;
  value: string;
  timeout?: number;
}) => {
  // eslint-disable-next-line playwright/no-wait-for-timeout
  await page.waitForTimeout(timeout);

  await page.getByLabel(label).fill(value);
};
