import React, { useEffect, type FC, useState } from 'react';
import { defineMessages } from 'react-intl';

import { useCreateKycLinksMutation } from '~gql';
import { formatText } from '~utils/intl.ts';
import Modal from '~v5/shared/Modal/Modal.tsx';

import ModalHeading from '../ModalHeading/ModalHeading.tsx';
import PersonalDetailsForm from '../PersonalDetailsForm/index.ts';
import Stepper from '../Stepper.tsx';

interface VerificationModalProps {
  existingKycLink: string;
  isOpened: boolean;
  onClose: () => void;
  onTermsAcceptance: (kycLink: string) => void;
}

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.VerificationModal';

enum TabId {
  PersonalDetails = 0,
  Terms = 1,
  KYC = 2,
}

const MSG = defineMessages({
  tcTitle: {
    id: `${displayName}.tcTitle`,
    defaultMessage: 'Terms & Privacy',
  },
  tcSubtitle: {
    id: `${displayName}.tcSubtitle`,
    defaultMessage:
      'Accept the terms and privacy of our partner provider Bridge to enable crypto to fiat functionality.',
  },
  personalDetailsTabHeading: {
    id: `${displayName}.personalDetailsTabHeading`,
    defaultMessage: 'Personal details',
  },
  termsTabHeading: {
    id: `${displayName}.termsTabHeading`,
    defaultMessage: 'Terms',
  },
  kycTabHeading: {
    id: `${displayName}.kycTabHeading`,
    defaultMessage: 'KYC',
  },
});

const VerificationModal: FC<VerificationModalProps> = ({
  existingKycLink,
  isOpened,
  onClose,
  onTermsAcceptance,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>(TabId.PersonalDetails);

  const [kycLink, setKycLink] = useState(existingKycLink);
  const [termsLink, setTermsLink] = useState<string | null>(null);

  const [createKycLinks] = useCreateKycLinksMutation();

  useEffect(() => {
    const handler = (ev: MessageEvent) => {
      if (ev.data.signedAgreementId) {
        onTermsAcceptance(kycLink);
      }
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, [kycLink, onTermsAcceptance]);

  const handlePersonalDetailsSubmit = async ({
    email,
    firstName,
    lastName,
  }: any) => {
    const response = await createKycLinks({
      variables: {
        email,
        fullName: `${firstName} ${lastName}`,
      },
    });

    const responseTermsLink = response.data?.bridgeXYZMutation?.tos_link;
    const responseKycLink = response.data?.bridgeXYZMutation?.kyc_link;

    if (responseTermsLink && responseKycLink) {
      setTermsLink(responseTermsLink);
      setKycLink(responseKycLink);

      setActiveTab(TabId.Terms);
    } else {
      // Notify the user via a Toast or something
    }
  };

  return (
    <Modal
      isFullOnMobile={false}
      isOpen={isOpened}
      onClose={onClose}
      withPaddingBottom
    >
      <div className="pt-10">
        <Stepper
          activeStepKey={activeTab}
          items={[
            {
              key: TabId.PersonalDetails,
              heading: {
                label: formatText(MSG.personalDetailsTabHeading),
              },

              content: (
                <div>
                  <PersonalDetailsForm
                    onSubmit={handlePersonalDetailsSubmit}
                    onClose={onClose}
                  />
                </div>
              ),
            },
            {
              key: TabId.Terms,
              heading: {
                label: formatText(MSG.termsTabHeading),
              },
              content: (
                <div>
                  <ModalHeading title={MSG.tcTitle} subtitle={MSG.tcSubtitle} />
                  <div className="flex justify-center">
                    {termsLink && (
                      <iframe
                        title="Terms iframe"
                        src={termsLink}
                        scrolling="no"
                        className="min-h-[20.2rem] min-w-[25rem]"
                      />
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: TabId.KYC,
              heading: {
                label: formatText(MSG.kycTabHeading),
              },
              content: null,
            },
          ]}
        />
      </div>
    </Modal>
  );
};

VerificationModal.displayName = displayName;

export default VerificationModal;
