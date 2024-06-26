import React, { useEffect, useState, type FC } from 'react';
import { useIntl } from 'react-intl';

import { CloseButton } from '~v5/shared/Button/index.ts';
import ModalBase from '~v5/shared/Modal/ModalBase.tsx';

import { PersonalDetailsForm } from '../PersonalDetailsForm/index.tsx';
import Stepper from '../Stepper/index.tsx';

interface KYCModalProps {
  isOpened: boolean;
  onClose: () => void;
}

enum TabId {
  Terms = 0,
  PersonalDetails = 1,
  BankDetails = 2,
}

export const KYCModal: FC<KYCModalProps> = ({ isOpened, onClose }) => {
  const { formatMessage } = useIntl();

  const [activeTab, setActiveTab] = useState<TabId>(TabId.Terms);

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
                key: TabId.Terms,
                heading: {
                  label: 'Terms',
                },
                content: (
                  <div>
                    <h2 className="text-2">Terms & Privacy</h2>
                    <p className="whitespace-pre-wrap text-md">
                      Accept the terms and privacy of our partner provider
                      Bridge to enable crypto to fiat functionality.
                    </p>
                    <iframe
                      title="Terms iframe"
                      src="http://localhost:3007/bridgexyz/accept-terms-of-service"
                    />
                  </div>
                ),
              },
              {
                key: TabId.PersonalDetails,
                heading: {
                  label: 'Personal details',
                },

                content: (
                  <div>
                    <PersonalDetailsForm
                      onSubmit={(values) => {
                        // eslint-disable-next-line no-console
                        console.log(values);
                        setActiveTab(TabId.BankDetails);
                      }}
                    />
                  </div>
                ),
              },
              {
                key: TabId.BankDetails,
                heading: {
                  label: 'Bank details',
                },

                content: <div>Test 1</div>,
              },
            ]}
          />
        </div>
      </ModalBase>
    </div>
  );
};
