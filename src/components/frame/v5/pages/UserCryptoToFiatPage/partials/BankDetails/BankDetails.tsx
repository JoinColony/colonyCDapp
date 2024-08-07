import React, { useState } from 'react';

import { formatText } from '~utils/intl.ts';

import { useCryptoToFiatContext } from '../../context/CryptoToFiatContext.ts';
import BankDetailsModal from '../BankDetailsModal/index.ts';
import RowItem from '../RowItem/index.ts';

import {
  displayName,
  getBadgeProps,
  getCTAScheme,
  HEADING_MSG,
} from './consts.ts';
import BankDetailsDescriptionComponent from './partials/BankDetailsDescriptionComponent/BankDetailsDescriptionComponent.tsx';
import { BankDetailsStatus } from './types.ts';

const BankDetails = () => {
  const { kycStatusData, bankAccountData, isKycStatusDataLoading } =
    useCryptoToFiatContext();

  const [isOpened, setOpened] = useState(false);
  const handleOpen = () => setOpened(true);
  const handleClose = () => setOpened(false);

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
        itemIndex={2}
        isDataLoading={isKycStatusDataLoading}
      />
      <RowItem.Body
        descriptionComponent={
          <BankDetailsDescriptionComponent
            bankAccount={bankAccountData}
            isDataLoading={isKycStatusDataLoading}
          />
        }
        ctaTitle={ctaScheme.ctaTitle}
        ctaOnClick={handleOpen}
        ctaDisabled={ctaScheme.ctaDisabled}
        isDataLoading={isKycStatusDataLoading}
      />

      {isOpened && (
        <BankDetailsModal
          data={bankAccountData}
          isOpened={isOpened}
          onClose={handleClose}
        />
      )}
    </RowItem.Container>
  );
};

BankDetails.displayName = displayName;

export default BankDetails;
