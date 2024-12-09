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
  baseUrl = '',
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

export const fillInput = async ({
  page,
  label,
  selector,
  value,
}: {
  page: Page;
  label?: string | RegExp;
  selector?: string;
  value: string;
}) => {
  if (!label && !selector) {
    throw new Error('You must provide either a label or a selector');
  }
  const input = label ? page.getByLabel(label) : page.locator(selector!);

  await input.fill(value);
  await expect(input).toHaveValue(value);
};

export const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

export const generateRandomEmail = () => {
  return `${generateRandomString()}@example.com`;
};

const customTimeout = parseInt(process.env.E2E_TIMEOUT || '3000', 10); // Allow to run with different timeout, defaults to 3000ms

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

export const signInAndNavigateToColony = async (
  page: Page,
  { colonyUrl, wallet }: { colonyUrl: string; wallet: string | RegExp },
) => {
  await page.goto(colonyUrl);
  await selectWallet(page, wallet);
  // Wait for the Dashboard to load
  await page.getByText('Loading Colony').waitFor({ state: 'hidden' });
  await page
    .getByTestId('loading-skeleton')
    .last()
    .waitFor({ state: 'hidden' });
};

export const enableReputationWaightedExtension = async (
  page: Page,
  {
    colonyPath,
  }: {
    colonyPath: string;
  },
) => {
  await page.goto(`${colonyPath}/extensions/VotingReputation`);
  await page.getByText('Loading colony').waitFor({ state: 'hidden' });

  const installExtensionButton = page.getByRole('button', {
    name: 'Install',
  });

  const enableExtensionButton = page.getByRole('button', {
    name: 'Enable',
  });

  await installExtensionButton.click();

  await enableExtensionButton.click();

  await page.getByRole('button', { name: 'Pending' }).waitFor({
    state: 'hidden',
  });

  await page
    .getByRole('listitem')
    .filter({ hasText: 'Testing governance' })
    .click();

  await enableExtensionButton.click();

  await page.getByRole('button', { name: 'Deprecate extension' }).waitFor();
};

export const deprecateReputationWaightedExtension = async (
  page: Page,
  {
    colonyPath,
  }: {
    colonyPath: string;
  },
) => {
  await page.goto(`${colonyPath}/extensions/VotingReputation`);
  await page.getByText('Loading colony').waitFor({ state: 'hidden' });

  await page.getByRole('button', { name: 'Deprecate extension' }).click();

  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Deprecate' })
    .click();

  await page.getByRole('button', { name: 'Uninstall extension' }).click();

  await page
    .getByRole('dialog')
    .getByText('I understand that there is a risk')
    .click();

  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Continue with uninstalling' })
    .click();

  await page.getByRole('button', { name: 'Install' }).waitFor();
};
