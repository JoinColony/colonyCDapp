import clsx from 'clsx';
import React, { type FC, useState } from 'react';

import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { type CryptoToFiatPageComponentProps } from '../../types.ts';
import { BankDetailsModal } from '../BankDetailsModal/index.tsx';
import RowItem from '../RowItem/index.ts';

import {
  displayName,
  getCTAScheme,
  getStatusPillScheme,
  HEADING_MSG,
} from './consts.ts';
import BankDetailsDescriptionComponent from './partials/BankDetailsDescriptionComponent/BankDetailsDescriptionComponent.tsx';
import { BankDetailsStatus } from './types.ts';

const BankDetails: FC<CryptoToFiatPageComponentProps> = ({
  order,
  kycStatusData,
}) => {
  const [isOpened, setOpened] = useState(false);
  const handleOpen = () => setOpened(true);
  const handleClose = () => setOpened(false);

  const bankAccountData = kycStatusData?.bankAccount;

  const status = bankAccountData
    ? BankDetailsStatus.COMPLETED
    : BankDetailsStatus.NOT_STARTED;

  const statusPillScheme = getStatusPillScheme(status);

  const ctaScheme = getCTAScheme({ bankAccountData, kycStatusData });

  return (
    <RowItem.Container>
      <RowItem.Heading
        title={HEADING_MSG.title}
        accessory={HEADING_MSG.accessory}
        statusPill={
          // Move this inside the RowItem.Heading component
          <PillsBase
            icon={statusPillScheme.icon}
            iconClassName={statusPillScheme.iconClassName}
            className={clsx(
              statusPillScheme.bgClassName,
              'text-sm font-medium',
            )}
            isCapitalized={false}
          >
            <span className={statusPillScheme.textClassName}>
              {statusPillScheme.copy}
            </span>
          </PillsBase>
        }
        itemOrder={order}
      />
      <RowItem.Body
        descriptionComponent={
          <BankDetailsDescriptionComponent bankAccount={bankAccountData} />
        }
        ctaTitle={ctaScheme.ctaTitle}
        ctaOnClick={handleOpen}
        ctaDisabled={ctaScheme.ctaDisabled}
      />

      {isOpened && (
        <BankDetailsModal isOpened={isOpened} onClose={handleClose} />
      )}
    </RowItem.Container>
  );
};

BankDetails.displayName = displayName;

export default BankDetails;
