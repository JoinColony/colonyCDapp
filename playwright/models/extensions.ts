import type { Page, Locator } from '@playwright/test';

export class Extensions {
  installExtensionButton: Locator;

  enableExtensionButton: Locator;

  deprecateExtensionButton: Locator;

  uninstallExtensionButton: Locator;

  constructor(private page: Page) {
    this.installExtensionButton = this.page.getByRole('button', {
      name: 'Install',
      exact: true,
    });

    this.enableExtensionButton = this.page.getByRole('button', {
      name: 'Enable',
      exact: true,
    });

    this.deprecateExtensionButton = this.page.getByRole('button', {
      name: 'Deprecate',
    });

    this.uninstallExtensionButton = this.page.getByRole('button', {
      name: 'Uninstall',
    });
  }

  async goToExtensionsPage({
    colonyPath,
    extension,
  }: {
    colonyPath: string;
    extension: string;
  }) {
    await this.page.goto(`${colonyPath}/extensions/${extension}`);
  }

  async enableReputationWeightedExtension({
    colonyPath,
  }: {
    colonyPath: string;
  }) {
    await this.goToExtensionsPage({
      colonyPath,
      extension: 'VotingReputation',
    });
    await this.page.getByText('Loading colony').waitFor({ state: 'hidden' });
    await this.page
      .getByRole('heading', { name: 'Extension details' })
      .waitFor();
    if (await this.deprecateExtensionButton.isVisible()) {
      return;
    }
    await this.installExtensionButton.click();

    await this.page.getByRole('button', { name: 'Pending' }).waitFor({
      state: 'hidden',
    });

    await this.page
      .getByRole('listitem')
      .filter({ hasText: 'Testing governance' })
      .click();

    await this.enableExtensionButton.click();

    await this.deprecateExtensionButton.waitFor();
  }

  async uninstallReputationWeightedExtension({
    colonyPath,
  }: {
    colonyPath: string;
  }) {
    await this.goToExtensionsPage({
      colonyPath,
      extension: 'VotingReputation',
    });

    await this.page.getByText('Loading colony').waitFor({ state: 'hidden' });
    await this.page
      .getByRole('heading', { name: 'Extension details' })
      .waitFor();
    if (await this.installExtensionButton.isVisible()) {
      return;
    }

    await this.deprecateExtensionButton.click();

    await this.page
      .getByRole('dialog')
      .getByRole('button', { name: /Deprecate/ })
      .click();

    await this.uninstallExtensionButton.click();
    const dialog = this.page.getByRole('dialog');

    await dialog.getByText('I understand that there is a risk').click();

    await dialog
      .getByRole('button', { name: 'Continue with uninstalling' })
      .click();

    await this.installExtensionButton.waitFor();
  }

  async enableStagedExpenditureExtension({
    colonyPath,
  }: {
    colonyPath: string;
  }) {
    await this.goToExtensionsPage({
      colonyPath,
      extension: 'StagedExpenditure',
    });
    await this.page.getByText('Loading colony').waitFor({ state: 'hidden' });
    await this.page
      .getByRole('heading', { name: 'Extension details' })
      .waitFor();
    if (await this.deprecateExtensionButton.isVisible()) {
      return;
    }
    await this.installExtensionButton.click();

    await this.deprecateExtensionButton.waitFor();
  }

  async uninstallStagedExpenditureExtension({
    colonyPath,
  }: {
    colonyPath: string;
  }) {
    await this.goToExtensionsPage({
      colonyPath,
      extension: 'StagedExpenditure',
    });
    await this.page.getByText('Loading colony').waitFor({ state: 'hidden' });

    if (await this.installExtensionButton.isVisible()) {
      return;
    }

    await this.deprecateExtensionButton.click();

    await this.page
      .getByRole('dialog')
      .getByRole('button', { name: 'Deprecate' })
      .click();

    await this.uninstallExtensionButton.click();

    await this.page
      .getByRole('dialog')
      .getByText('I understand that unreleased funds cannot be released')
      .click();

    await this.page
      .getByRole('dialog')
      .getByRole('button', { name: 'Continue with uninstalling' })
      .click();

    await this.installExtensionButton.waitFor();
  }
}
