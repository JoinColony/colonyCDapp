import React, { useEffect, useState, type FC } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { type CountryData } from '~utils/countries.ts';
import { CloseButton } from '~v5/shared/Button/index.ts';
import ModalBase from '~v5/shared/Modal/ModalBase.tsx';

import { BankDetailsForm } from '../BankDetailsForm/index.tsx';
import { ContactDetailsForm } from '../ContactDetailsForm/index.tsx';
import ModalHeading from '../ModalHeading/ModalHeading.tsx';
import { PersonalDetailsForm } from '../PersonalDetailsForm/index.tsx';
import Stepper from '../Stepper/index.tsx';

interface KYCModalProps {
  isOpened: boolean;
  onClose: () => void;
}

enum TabId {
  PersonalDetails = 0,
  Terms = 1,
  ContactDetails = 2,
  BankDetails = 3,
}

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.KYCModal';

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

export const KYCModal: FC<KYCModalProps> = ({ isOpened, onClose }) => {
  const { formatMessage } = useIntl();

  const [activeTab, setActiveTab] = useState<TabId>(TabId.PersonalDetails);

  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null,
  );

  useEffect(() => {
    const handler = (ev: MessageEvent<{ type: string; message: string }>) => {
      if (ev?.data && 'signedAgreementId' in ev.data) {
        setActiveTab((prev) => prev + 1);
      }
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div>
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
                      selectedCountry={selectedCountry}
                      handleSelectCountry={(value) =>
                        setSelectedCountry(value as any)
                      }
                      onSubmit={(values) => {
                        // eslint-disable-next-line no-console
                        console.log(values);
                        setActiveTab(TabId.Terms);
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
                    <ModalHeading
                      title={MSG.tcTitle}
                      subtitle={MSG.tcSubtitle}
                    />
                    <iframe
                      title="Terms iframe"
                      src="http://localhost:3007/bridgexyz/accept-terms-of-service"
                    />
                  </div>
                ),
              },
              {
                key: TabId.ContactDetails,
                heading: {
                  label: 'Contact details',
                },
                content: (
                  <ContactDetailsForm
                    selectedCountry={selectedCountry}
                    onSubmit={(values) => {
                      // eslint-disable-next-line no-console
                      console.log(values);
                      setActiveTab(TabId.BankDetails);
                    }}
                    onClose={onClose}
                  />
                ),
              },
              {
                key: TabId.BankDetails,
                heading: {
                  label: 'Bank details',
                },

                content: (
                  <BankDetailsForm
                    onSubmit={(values) => {
                      // eslint-disable-next-line no-console
                      console.log(values);
                      setActiveTab(TabId.BankDetails);
                    }}
                    onClose={onClose}
                  />
                ),
              },
            ]}
          />
        </div>
      </ModalBase>
    </div>
  );
};
