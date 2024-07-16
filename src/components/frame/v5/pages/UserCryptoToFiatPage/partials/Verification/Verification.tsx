import React, { type FC, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CRYPTO_TO_FIAT_VERIFICATION_SEARCH_PARAM } from '~routes/routeConstants.ts';
import { formatText } from '~utils/intl.ts';

import { type CryptoToFiatPageComponentProps } from '../../types.ts';
import { KYCModal } from '../KYCModal/index.tsx';
import RowItem from '../RowItem/index.ts';

import { MSG, displayName, getBadgeProps, getCTAProps } from './consts.ts';

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

  const badgeProps = getBadgeProps(kycStatus);
  const ctaProps = getCTAProps(kycStatus);

  return (
    <RowItem.Container>
      <RowItem.Heading
        title={formatText(MSG.headingTitle)}
        accessory={formatText(MSG.headingAccessory)}
        itemOrder={order}
        badgeProps={badgeProps}
      />
      <RowItem.Body
        title={formatText(MSG.bodyTitle)}
        description={formatText(MSG.bodyDescription)}
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
