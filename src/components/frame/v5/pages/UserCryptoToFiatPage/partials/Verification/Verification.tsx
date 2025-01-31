import { Client as PersonaClient } from 'persona';
import React, { useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useCryptoToFiatContext } from '~frame/v5/pages/UserCryptoToFiatPage/context/CryptoToFiatContext.ts';
import { useUpdateUserProfileMutation } from '~gql';
import { formatText } from '~utils/intl.ts';

import RowItem from '../RowItem/index.ts';

import { MSG, displayName, getBadgeProps, getCTAProps } from './consts.ts';
import { parsePersonaURL } from './helpers.ts';
import VerificationModal from './VerificationModal.tsx';

const Verification = () => {
  const [updateProfile] = useUpdateUserProfileMutation();

  const { user } = useAppContext();

  const { kycStatusData, isKycStatusDataLoading, refetchKycData } =
    useCryptoToFiatContext();

  const [isModalOpened, setIsModalOpened] = useState(false);
  const handleOpen = () => setIsModalOpened(true);
  const handleClose = () => setIsModalOpened(false);

  const kycStatus = kycStatusData?.kycStatus;

  const badgeProps = getBadgeProps(kycStatus);
  const ctaProps = getCTAProps(kycStatus);

  const handleTermsAcceptance = (kycLink: string) => {
    handleClose();

    const personaParams = parsePersonaURL(kycLink);
    if (!personaParams) {
      return;
    }

    const { templateId, referenceId, fields } = personaParams;

    const personaClient = new PersonaClient({
      templateId,
      referenceId,
      environmentId: import.meta.env.PERSONA_ENVIRONMENT_ID,
      fields,
      async onComplete() {
        await updateProfile({
          variables: {
            input: {
              id: user?.walletAddress ?? '',
              hasCompletedKYCFlow: true,
            },
          },
        });

        refetchKycData();
      },
    });

    personaClient.open();
  };

  return (
    <RowItem.Container>
      <RowItem.Heading
        title={formatText(MSG.headingTitle)}
        accessory={formatText(MSG.headingAccessory)}
        itemIndex={1}
        badgeProps={badgeProps}
        isDataLoading={isKycStatusDataLoading}
      />
      <RowItem.Body
        title={formatText(MSG.bodyTitle)}
        description={formatText(MSG.bodyDescription)}
        {...ctaProps}
        ctaOnClick={handleOpen}
        isDataLoading={isKycStatusDataLoading}
      />

      {isModalOpened && (
        <VerificationModal
          isOpened={isModalOpened}
          onClose={handleClose}
          existingKycLink={kycStatusData?.kycLink ?? ''}
          onTermsAcceptance={handleTermsAcceptance}
        />
      )}
    </RowItem.Container>
  );
};

Verification.displayName = displayName;

export default Verification;
