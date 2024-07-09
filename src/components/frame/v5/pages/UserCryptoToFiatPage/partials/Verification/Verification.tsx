import clsx from 'clsx';
import React, { type FC, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import { useCheckKycStatusMutation } from '~gql';
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

const Verification: FC<CryptoToFiatPageComponentProps> = ({ order }) => {
  // const status = 'notStarted';
  const [checkKycStatus] = useCheckKycStatusMutation();
  const [status, setStatus] = useState<string | null | undefined>(
    'not-started',
  );
  const [url, setUrl] = useState<string | null | undefined>('');

  const [searchParams] = useSearchParams();
  const isInitialOpened = !!searchParams?.has(
    CRYPTO_TO_FIAT_VERIFICATION_SEARCH_PARAM,
  );
  const [isOpened, setOpened] = useState(isInitialOpened);
  const handleOpen = () => setOpened(true);
  const handleClose = () => setOpened(false);

  const statusPillScheme = getStatusPillScheme(status);
  const ctaProps = getCTAProps(status);

  useEffect(() => {
    checkKycStatus()
      .then(({ data }) => {
        setStatus(data?.bridgeXYZMutation?.kyc_status);
        setUrl(data?.bridgeXYZMutation?.kyc_link);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('Error! ', err);
      });
  }, [checkKycStatus]);

  return (
    <RowItem.Container>
      <RowItem.Heading
        title={MSG.headingTitle}
        accessory={MSG.headingAccessory}
        itemOrder={order}
        statusPill={
          // Move this inside the RowItem.Heading component
          <PillsBase
            icon={statusPillScheme.icon}
            iconClassName={statusPillScheme.iconClassName}
            className={clsx(
              statusPillScheme.bgClassName,
              'text-sm font-medium',
            )}
          >
            <span className={statusPillScheme.textClassName}>
              {status && formatText(STATUS_MSGS[status])}
            </span>
          </PillsBase>
        }
      />
      <RowItem.Body
        title={MSG.bodyTitle}
        description={MSG.bodyDescription}
        {...ctaProps}
        ctaOnClick={handleOpen}
      />

      {isOpened && url && (
        <KYCModal isOpened={isOpened} onClose={handleClose} url={url} />
      )}
    </RowItem.Container>
  );
};

Verification.displayName = displayName;

export default Verification;
