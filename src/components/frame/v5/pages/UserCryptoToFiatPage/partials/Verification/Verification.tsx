import clsx from 'clsx';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import { CRYPTO_TO_FIAT_VERIFICATION_SEARCH_PARAM } from '~routes/routeConstants.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { KYCModal } from '../KYCModal/index.tsx';
import RowItem from '../RowItem/index.ts';

import { statusPillScheme } from './consts.ts';

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

const Verification = () => {
  const status = 'notStarted';

  const [searchParams] = useSearchParams();
  const isInitialOpened = !!searchParams?.has(
    CRYPTO_TO_FIAT_VERIFICATION_SEARCH_PARAM,
  );
  const [isOpened, setOpened] = useState(isInitialOpened);
  const handleOpen = () => setOpened(true);
  const handleClose = () => setOpened(false);

  return (
    <RowItem.Container>
      <RowItem.Heading
        title={MSG.headingTitle}
        accessory={MSG.headingAccessory}
        itemOrder={2}
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
        ctaTitle={MSG.bodyCtaTitle}
        ctaOnClick={handleOpen}
      />

      {isOpened && <KYCModal isOpened={isOpened} onClose={handleClose} />}
    </RowItem.Container>
  );
};

Verification.displayName = displayName;

export default Verification;
