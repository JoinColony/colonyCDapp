import clsx from 'clsx';
import React, { type FC, useState } from 'react';
import { defineMessages } from 'react-intl';

import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { type CryptoToFiatPageComponentProps } from '../../types.ts';
import { BankDetailsModal } from '../BankDetailsModal/index.tsx';
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

const BankDetails: FC<CryptoToFiatPageComponentProps> = ({
  order,
  statusData,
}) => {
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
              {statusData?.bankAccount ? 'Completed' : 'Not completed'}
            </span>
          </PillsBase>
        }
        itemOrder={order}
      />
      <RowItem.Body
        descriptionComponent={
          <BankDetailsDescriptionComponent
            bankAccount={statusData?.bankAccount}
          />
        }
        ctaTitle={MSG.ctaTitle}
        ctaOnClick={handleOpen}
        ctaDisabled={
          statusData?.kyc_status !== 'approved' || !!statusData.bankAccount
        }
      />

      {isOpened && (
        <BankDetailsModal isOpened={isOpened} onClose={handleClose} />
      )}
    </RowItem.Container>
  );
};

BankDetails.displayName = displayName;

export default BankDetails;
