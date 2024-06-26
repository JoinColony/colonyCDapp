import clsx from 'clsx';
import React from 'react';
import { defineMessages } from 'react-intl';

import Switch from '~v5/common/Fields/Switch/Switch.tsx';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import RowItem from '../RowItem/index.ts';

import { statusPillScheme } from './consts.ts';

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.AutomaticDeposits';

const MSG = defineMessages({
  headingTitle: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Bank details',
  },
  headingAccessory: {
    id: `${displayName}.headingAccessory`,
    defaultMessage: 'Required',
  },
  bodyTitle: {
    id: `${displayName}.bodyTitle`,
    defaultMessage: 'Automatically deposit USDC payments to your bank account',
  },
  bodyDescription: {
    id: `${displayName}.bodyDescription`,
    defaultMessage:
      'Enable this to autmoatically USD or EUR in your account any time you receive a USDC payment from the colony app. A gateway fee, plus any transaction costs will be deducted from your payment',
  },
  bodyCtaTitle: {
    id: `${displayName}.bodyCtaTitle`,
    defaultMessage: 'Start KYC',
  },
});

const AutomaticDeposits = () => {
  const status = 'kycPaymentRequired';

  return (
    <RowItem.Container>
      <RowItem.Heading
        title={MSG.headingTitle}
        accessory={MSG.headingAccessory}
        itemOrder={3}
        statusPill={
          // Move this inside the RowItem.Heading component
          <PillsBase
            className={clsx(
              statusPillScheme[status].bgClassName,
              'text-sm font-medium',
            )}
          >
            <span className={statusPillScheme[status].textClassName}>
              {status}
            </span>
          </PillsBase>
        }
      />
      <RowItem.Body
        title={MSG.bodyTitle}
        description={MSG.bodyDescription}
        ctaComponent={<Switch />}
      />
    </RowItem.Container>
  );
};

AutomaticDeposits.displayName = displayName;

export default AutomaticDeposits;
