import clsx from 'clsx';
import React from 'react';
import { defineMessages } from 'react-intl';

import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import RowItem from '../RowItem/index.ts';

import { statusPillScheme } from './consts.ts';
import BankDetailsDescriptionComponent from './partials/BankDetailsDescriptionComponent/BankDetailsDescriptionComponent.tsx';

const displayName = 'v5.pages.UserCryptoToFiat.partials.BankDetails';

const MSG = defineMessages({
  headingTitle: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Bank details',
  },
  headingAccessory: {
    id: `${displayName}.headingAccessory`,
    defaultMessage: 'Required',
  },
  ctaTitle: {
    id: `${displayName}.ctaTitle`,
    defaultMessage: 'Add details',
  },
});

const BankDetails = () => {
  const status = 'notStarted';

  return (
    <RowItem.Container>
      <RowItem.Heading
        title={MSG.headingTitle}
        accessory={MSG.headingAccessory}
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
        itemOrder={1}
      />
      <RowItem.Body
        descriptionComponent={<BankDetailsDescriptionComponent />}
        ctaTitle={MSG.ctaTitle}
        // eslint-disable-next-line no-console
        ctaOnClick={() => console.log('Handle bank details here')}
      />
    </RowItem.Container>
  );
};

BankDetails.displayName = displayName;

export default BankDetails;
