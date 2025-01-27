import { type Locator, expect, type Page } from '@playwright/test';
import { forwardTime } from 'playwright/utils/common';

export interface ReputationFlowModel {
  page: Page;
  stepper: Locator;
  completedAction: Locator;
  supportButton: Locator;
  opposeButton: Locator;
  submitVoteButton: Locator;
  revealVoteButton: Locator;
  finalizeButton: Locator;
  claimButton: Locator;
  waitForPending(): Promise<void>;
}

export class ReputationFlow {
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(private model: ReputationFlowModel) {}

  async completeVotingWithSupport() {
    await this.voteOnMotion('Support');
    await this.model.stepper.getByText('100% Supported').waitFor();

    await forwardTime(1);

    await this.model.page.reload();
    await this.model.page.getByText('Loading').waitFor({ state: 'hidden' });
    await this.model.page
      .getByTestId('loading-skeleton')
      .last()
      .waitFor({ state: 'hidden' });

    await expect(
      this.model.stepper.getByRole('button', { name: 'Staking', exact: true }),
    ).toBeVisible();
    await this.model.stepper
      .getByRole('button', { name: 'Supported' })
      .waitFor();

    await expect(
      this.model.stepper.getByRole('button', { name: 'Finalize' }),
    ).toHaveCount(2);
    await this.model.finalizeButton.last().click();

    await this.model.claimButton.click();

    await this.model.completedAction
      .getByRole('heading', { name: 'Your overview Claimed' })
      .waitFor();

    await this.model.claimButton.waitFor({ state: 'hidden' });
  }

  async completeFullVotingWithSupport() {
    await expect(this.model.stepper).toBeVisible();

    await expect(
      this.model.stepper.getByText(/Total stake required: \d+/),
    ).toBeVisible();

    await this.voteOnMotion('Support');

    await expect(this.model.stepper).toHaveText(/100% Supported/);

    await this.voteOnMotion('Oppose');
    await expect(this.model.stepper).toHaveText(/100% Opposed/);

    await this.model.stepper.getByText(/Vote to support or oppose?/).waitFor();
    await this.model.supportButton.click();
    await this.model.supportButton.waitFor({ state: 'hidden' });
    await this.model.submitVoteButton.click();
    await this.model.submitVoteButton.waitFor({ state: 'hidden' });
    await this.model.revealVoteButton.click();
    await this.model.stepper.getByText('1 vote revealed').waitFor();

    await expect(
      this.model.stepper.getByText(
        'Finalize to execute the agreed transaction',
      ),
    ).toBeVisible();
    await this.model.finalizeButton.click();

    await this.model.claimButton.click();

    await this.model.completedAction
      .getByRole('heading', { name: 'Your overview Claimed' })
      .waitFor();

    await this.model.claimButton.waitFor({ state: 'hidden' });
  }

  async voteOnMotion(voteType: 'Support' | 'Oppose') {
    await this.model.completedAction
      .getByRole('heading', {
        name: 'Total stake required',
      })
      .waitFor({ state: 'visible' });
    await this.model.completedAction.getByTestId('countDownTimer').waitFor({
      state: 'visible',
    });
    await this.model.completedAction
      .getByText(voteType, { exact: true })
      .click();
    await this.model.completedAction
      .getByRole('button', { name: 'Max' })
      .click();

    await this.model.completedAction
      .getByRole('button', { name: 'Stake' })
      .click();

    await this.model.completedAction
      .getByRole('button', { name: 'Stake' })
      .waitFor({
        state: 'hidden',
      });
  }
}
