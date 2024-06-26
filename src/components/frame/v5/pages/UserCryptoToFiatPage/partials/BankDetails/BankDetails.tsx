import clsx from 'clsx';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { KYCModal } from '../KYCModal/index.tsx';
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

  const [isOpened, setOpened] = useState(false);
  const handleOpen = () => setOpened(true);
  const handleClose = () => setOpened(false);

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
        ctaOnClick={handleOpen}
      />

      {isOpened && <KYCModal isOpened={isOpened} onClose={handleClose} />}
    </RowItem.Container>
  );
};

BankDetails.displayName = displayName;

export default BankDetails;
