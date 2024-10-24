import { type Page } from '@playwright/test';

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
