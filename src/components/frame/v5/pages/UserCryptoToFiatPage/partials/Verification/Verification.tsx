import clsx from 'clsx';
import React, { type FC, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CRYPTO_TO_FIAT_VERIFICATION_SEARCH_PARAM } from '~routes/routeConstants.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { type CryptoToFiatPageComponentProps } from '../../types.ts';
import { KYCModal } from '../KYCModal/index.tsx';
import RowItem from '../RowItem/index.ts';

import {
  MSG,
  displayName,
  getCTAProps,
  getStatusPillScheme,
} from './consts.ts';

const Verification: FC<CryptoToFiatPageComponentProps> = ({
  order,
  kycStatusData,
}) => {
  const [searchParams] = useSearchParams();
  const isInitialOpened = !!searchParams?.has(
    CRYPTO_TO_FIAT_VERIFICATION_SEARCH_PARAM,
  );
  const [isOpened, setOpened] = useState(isInitialOpened);
  const handleOpen = () => setOpened(true);
  const handleClose = () => setOpened(false);

  const kycStatus = kycStatusData?.kyc_status;

  const statusPillScheme = getStatusPillScheme(kycStatus);
  const ctaProps = getCTAProps(kycStatus);

  return (
    <RowItem.Container>
      <RowItem.Heading
        title={MSG.headingTitle}
        accessory={MSG.headingAccessory}
        itemOrder={order}
        statusPill={
          // Move this inside the RowItem.Heading component
          kycStatus && (
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
          )
        }
      />
      <RowItem.Body
        title={MSG.bodyTitle}
        description={MSG.bodyDescription}
        {...ctaProps}
        ctaOnClick={handleOpen}
      />

      {isOpened && (
        <KYCModal
          isOpened={isOpened}
          onClose={handleClose}
          existingKycLink={kycStatusData?.kyc_link ?? ''}
        />
      )}
    </RowItem.Container>
  );
};

Verification.displayName = displayName;

export default Verification;
