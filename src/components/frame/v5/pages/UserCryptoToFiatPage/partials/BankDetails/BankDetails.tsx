import React, { type FC, useState } from 'react';

import { formatText } from '~utils/intl.ts';

import { type CryptoToFiatPageComponentProps } from '../../types.ts';
import { BankDetailsModal } from '../BankDetailsModal/index.tsx';
import RowItem from '../RowItem/index.ts';

import {
  displayName,
  getBadgeProps,
  getCTAScheme,
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

  const badgeProps = getBadgeProps(status);

  const ctaScheme = getCTAScheme({ bankAccountData, kycStatusData });

  return (
    <RowItem.Container>
      <RowItem.Heading
        title={formatText(HEADING_MSG.title)}
        accessory={formatText(HEADING_MSG.accessory)}
        badgeProps={badgeProps}
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
