import clsx from 'clsx';
import React, { type FC, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import { CRYPTO_TO_FIAT_VERIFICATION_SEARCH_PARAM } from '~routes/routeConstants.ts';
import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { type CryptoToFiatPageComponentProps } from '../../types.ts';
import { KYCModal } from '../KYCModal/index.tsx';
import RowItem from '../RowItem/index.ts';

import { STATUS_MSGS, getCTAProps, getStatusPillScheme } from './consts.ts';

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.Verification';

const MSG = defineMessages({
  headingTitle: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Verification',
  },
  headingAccessory: {
    id: `${displayName}.headingAccessory`,
    defaultMessage: 'Required',
  },
  bodyTitle: {
    id: `${displayName}.bodyTitle`,
    defaultMessage: 'Know Your Customer/Anti Money Laundering (KYC/AML)',
  },
  bodyDescription: {
    id: `${displayName}.bodyDescription`,
    defaultMessage:
      'Regulatory compliance requires users to verify their account by completing KYC/AML checks. It only takes a couple of minutes.',
  },
  bodyCtaTitle: {
    id: `${displayName}.bodyCtaTitle`,
    defaultMessage: 'Start KYC',
  },
});

const Verification: FC<CryptoToFiatPageComponentProps> = ({
  order,
  statusData,
}) => {
  const [searchParams] = useSearchParams();
  const isInitialOpened = !!searchParams?.has(
    CRYPTO_TO_FIAT_VERIFICATION_SEARCH_PARAM,
  );
  const [isOpened, setOpened] = useState(isInitialOpened);
  const handleOpen = () => setOpened(true);
  const handleClose = () => setOpened(false);

  const kycStatus = statusData?.kyc_status;

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
            >
              <span className={statusPillScheme.textClassName}>
                {formatText(STATUS_MSGS[kycStatus])}
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
          existingKycLink={statusData?.kyc_link ?? ''}
        />
      )}
    </RowItem.Container>
  );
};

Verification.displayName = displayName;

export default Verification;
