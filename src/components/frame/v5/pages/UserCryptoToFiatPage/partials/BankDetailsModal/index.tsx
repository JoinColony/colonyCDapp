import React, { useEffect, useState, type FC } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { useUpdateBridgeCustomerMutation } from '~gql';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import { formatText } from '~utils/intl.ts';
import { CloseButton } from '~v5/shared/Button/index.ts';
import ModalBase from '~v5/shared/Modal/ModalBase.tsx';

import { formatDate } from '../../utils.ts';
import { BankDetailsForm } from '../BankDetailsForm/index.tsx';
import { ContactDetailsForm } from '../ContactDetailsForm/index.tsx';
import Stepper from '../Stepper/index.tsx';

interface BankDetailsModalProps {
  isOpened: boolean;
  onClose: () => void;
}

enum TabId {
  ContactDetails = 1,
  BankDetails = 2,
}

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.BankDetailsModal';

const MSG = defineMessages({
  bankDetailsConfirmed: {
    id: `${displayName}.bankDetailsConfirmed`,
    defaultMessage: 'Bank details confirmed',
  },
  bankInfoAddeddSuccessfully: {
    id: `${displayName}.bankInfoAddeddSuccessfully`,
    defaultMessage: 'Your information has been added sucessfully',
  },
});

export const BankDetailsModal: FC<BankDetailsModalProps> = ({
  isOpened,
  onClose,
}) => {
  const { formatMessage } = useIntl();

  const [activeTab, setActiveTab] = useState<TabId>(TabId.ContactDetails);

  const [kycFields, setKycFields] = useState<{
    signedAgreementId: string;
    birthDate: string;
    taxIdNumber: string;
    address: {
      city: string;
      country: string;
      postcode: string;
      state: string;
      address1: string;
      address2: string;
    };
  }>({
    signedAgreementId: '',
    birthDate: '',
    taxIdNumber: '',
    address: {
      city: '',
      country: '',
      postcode: '',
      state: '',
      address1: '',
      address2: '',
    },
  });

  useEffect(() => {
    const handler = (ev: MessageEvent<{ type: string; message: string }>) => {
      if (ev?.data && 'signedAgreementId' in ev.data) {
        const { signedAgreementId } = ev.data;

        setKycFields((state) => ({
          ...state,
          signedAgreementId: signedAgreementId as string,
        }));

        setActiveTab((prev) => prev + 1);
      }
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, []);

  const [updateBridgeCustomer] = useUpdateBridgeCustomerMutation();

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
              key: TabId.ContactDetails,
              heading: {
                label: 'Contact details',
              },
              content: (
                <ContactDetailsForm
                  selectedCountry={{} as any}
                  onSubmit={({
                    tax,
                    birthDate,
                    address1,
                    address2,
                    city,
                    postcode,
                  }) => {
                    setKycFields((state) => ({
                      ...state,
                      taxIdNumber: tax,
                      birthDate: formatDate(birthDate),
                      address: {
                        ...state.address,
                        address1,
                        address2,
                        city,
                        postcode,
                      },
                    }));

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
                  onSubmit={async () => {
                    const {
                      signedAgreementId,
                      birthDate,
                      taxIdNumber,
                      address: {
                        address1,
                        address2,
                        city,
                        country,
                        postcode,
                        state,
                      },
                    } = kycFields;

                    const result = await updateBridgeCustomer({
                      variables: {
                        signedAgreementId,
                        birthDate,
                        // eslint-disable-next-line no-warning-comments
                        firstName: 'test', // TODO: fix after updateBridgeCustomerMutation will be updated
                        lastName: 'test',
                        taxIdNumber,
                        email: 'test@email.com',
                        currency: 'eur',
                        iban: {
                          // eslint-disable-next-line camelcase
                          account_number: '12345',
                          bic: 'bicbic',
                          country: 'GBR',
                        },
                        address: {
                          city,
                          country,
                          // eslint-disable-next-line camelcase
                          street_line_1: address1,
                          // eslint-disable-next-line camelcase
                          street_line_2: address2,
                          postcode,
                          state: state || 'DAY',
                        },
                      },
                    });

                    if (result.data?.bridgeXYZMutation?.success) {
                      toast.success(
                        <Toast
                          type="success"
                          title={formatText(MSG.bankDetailsConfirmed)}
                          description={formatText(
                            MSG.bankInfoAddeddSuccessfully,
                          )}
                        />,
                      );

                      onClose();
                    } else {
                      // Show an error toast or something
                    }
                  }}
                  onClose={onClose}
                />
              ),
            },
          ]}
        />
      </div>
    </ModalBase>
  );
};
