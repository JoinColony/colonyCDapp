import { Client as PersonaClient } from 'persona';
import React, { type FC, useState } from 'react';

import { formatText } from '~utils/intl.ts';

import { type CryptoToFiatPageComponentProps } from '../../types.ts';
import RowItem from '../RowItem/index.ts';

import { MSG, displayName, getBadgeProps, getCTAProps } from './consts.ts';
import VerificationModal from './VerificationModal.tsx';

const Verification: FC<CryptoToFiatPageComponentProps> = ({
  order,
  kycStatusData,
}) => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const handleOpen = () => setIsModalOpened(true);
  const handleClose = () => setIsModalOpened(false);

  const kycStatus = kycStatusData?.kyc_status;

  const badgeProps = getBadgeProps(kycStatus);
  const ctaProps = getCTAProps(kycStatus);

  const handleTermsAcceptance = (kycLink: string) => {
    handleClose();

    const url = new URL(kycLink);
    const searchParams = new URLSearchParams(url.search);

    const templateId = searchParams.get('inquiry-template-id') ?? '';
    const referenceId = searchParams.get('reference-id') ?? '';

    const personaClient = new PersonaClient({
      templateId,
      referenceId,
      environmentId: 'env_AY6hSVzQeRamUtJB7ydFhnCx',
    });

    personaClient.open();
  };

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

      {isModalOpened && (
        <VerificationModal
          isOpened={isModalOpened}
          onClose={handleClose}
          existingKycLink={kycStatusData?.kyc_link ?? ''}
          onTermsAcceptance={handleTermsAcceptance}
        />
      )}
    </RowItem.Container>
  );
};

Verification.displayName = displayName;

export default Verification;
