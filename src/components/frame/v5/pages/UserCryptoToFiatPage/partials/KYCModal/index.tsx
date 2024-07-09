import React, { useEffect, useState, type FC } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { useCreateKycLinksMutation } from '~gql';
import { CloseButton } from '~v5/shared/Button/index.ts';
import ModalBase from '~v5/shared/Modal/ModalBase.tsx';

import ModalHeading from '../ModalHeading/ModalHeading.tsx';
import { PersonalDetailsForm } from '../PersonalDetailsForm/index.tsx';
import Stepper from '../Stepper/index.tsx';

interface KYCModalProps {
  url: string;
  isOpened: boolean;
  onClose: () => void;
}

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.KYCModal';

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
});

export const KYCModal: FC<KYCModalProps> = ({ url, isOpened, onClose }) => {
  const { formatMessage } = useIntl();

  const [activeTab, setActiveTab] = useState<TabId>(TabId.PersonalDetails);

  const [kycFields, setKycFields] = useState<{
    firstName: string;
    lastName: string;
    tosLink: string;
    email: string;
    country: string;
  }>({
    email: '',
    firstName: '',
    lastName: '',
    tosLink: '',
    country: '',
  });

  const [createKycLinks] = useCreateKycLinksMutation();

  useEffect(() => {
    const handler = (ev: MessageEvent<{ type: string; message: string }>) => {
      // eslint-disable-next-line no-console
      console.log(ev.data);
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <ModalBase
      isFullOnMobile={false}
      isOpen={isOpened}
      onRequestClose={onClose}
      isTopSectionWithBackground
    >
      <CloseButton
        aria-label={formatMessage({ id: 'ariaLabel.closeModal' })}
        title={formatMessage({ id: 'button.cancel' })}
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
      />
      <div className="px-6 py-12">
        <Stepper
          activeStepKey={activeTab}
          items={[
            {
              key: TabId.PersonalDetails,
              heading: {
                label: 'Personal details',
              },

              content: (
                <div>
                  <PersonalDetailsForm
                    onSubmit={async ({
                      email,
                      firstName,
                      lastName,
                      country,
                    }) => {
                      const response = await createKycLinks({
                        variables: {
                          email,
                          fullName: `${firstName} ${lastName}`,
                        },
                      });

                      const tosLink =
                        response.data?.bridgeXYZMutation?.tos_link;

                      if (tosLink) {
                        setKycFields((state) => ({
                          ...state,
                          firstName,
                          lastName,
                          tosLink,
                          email,
                          country,
                        }));

                        setActiveTab(TabId.Terms);
                      } else {
                        // Notify the user via a Toast or something
                      }
                    }}
                    onClose={onClose}
                  />
                </div>
              ),
            },
            {
              key: TabId.Terms,
              heading: {
                label: 'Terms',
              },
              content: (
                <div>
                  <ModalHeading title={MSG.tcTitle} subtitle={MSG.tcSubtitle} />
                  <div className="flex justify-center">
                    <iframe
                      title="Terms iframe"
                      src={kycFields.tosLink}
                      className="min-h-[20.2rem] min-w-[25rem]"
                    />
                  </div>
                </div>
              ),
            },
            {
              key: TabId.KYC,
              heading: {
                label: 'KYC',
              },
              content: (
                <div>
                  <iframe
                    title="Getting started"
                    src={url}
                    className="min-h-[20.2rem] min-w-[25rem]"
                  />
                </div>
              ),
            },
          ]}
        />
      </div>
    </ModalBase>
  );
};

KYCModal.displayName = displayName;
