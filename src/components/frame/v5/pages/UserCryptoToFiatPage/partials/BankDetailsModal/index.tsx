import React, { useState, type FC } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { useCreateBankAccountMutation } from '~gql';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import { formatText } from '~utils/intl.ts';
import { CloseButton } from '~v5/shared/Button/index.ts';
import ModalBase from '~v5/shared/Modal/ModalBase.tsx';

import { BankDetailsForm } from '../BankDetailsForm/index.tsx';
import { ContactDetailsForm } from '../ContactDetailsForm/index.tsx';
import Stepper from '../Stepper/index.tsx';

interface BankDetailsModalProps {
  isOpened: boolean;
  onClose: () => void;
}

enum TabId {
  BankDetails = 1,
  ContactDetails = 2,
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

  const [activeTab, setActiveTab] = useState<TabId>(TabId.BankDetails);

  const [bankDetailsFields, setBankDetailsFields] = useState<{
    currency: string;
    bankName: string;
    accountOwner: string;
    iban: string;
    swift: string;
    country: string;
    accountNumber: string;
    routingNumber: string;
    address1: string;
    address2: string;
    postcode: string;
    city: string;
    state: string;
  }>({
    currency: '',
    bankName: '',
    accountOwner: '',
    iban: '',
    swift: '',
    country: '',
    accountNumber: '',
    routingNumber: '',
    address1: '',
    address2: '',
    postcode: '',
    city: '',
    state: '',
  });

  // useEffect(() => {
  //   const handler = (ev: MessageEvent<{ type: string; message: string }>) => {
  //     if (ev?.data && 'signedAgreementId' in ev.data) {
  //       const { signedAgreementId } = ev.data;

  //       setKycFields((state) => ({
  //         ...state,
  //         signedAgreementId: signedAgreementId as string,
  //       }));

  //       setActiveTab((prev) => prev + 1);
  //     }
  //   };

  //   window.addEventListener('message', handler);

  //   return () => window.removeEventListener('message', handler);
  // }, []);

  // const [updateBridgeCustomer] = useUpdateBridgeCustomerMutation();
  const [createBankAccount] = useCreateBankAccountMutation();

  const [currentCurrency, setCurrentCurrency] = useState('');

  const handleSubmitForm = async (values) => {
    const {
      currency,
      bankName,
      accountOwner,
      iban,
      swift,
      country,
      accountNumber,
      routingNumber,
      address1,
      address2,
      postcode,
      city,
      state,
    } = values;

    const [firstName, lastName] = accountOwner.split(' ');

    let countryRelatedFields = {};

    if (currency === 'usd') {
      countryRelatedFields = {
        usAccount: {
          // eslint-disable-next-line camelcase
          account_number: accountNumber,
          // eslint-disable-next-line camelcase
          routing_number: routingNumber,
        },
        address: {
          city,
          country,
          // eslint-disable-next-line camelcase
          postal_code: postcode,
          // eslint-disable-next-line camelcase
          street_line_1: address1,
          // eslint-disable-next-line camelcase
          street_line_2: address2,
          state,
        },
      };
    } else {
      countryRelatedFields = {
        iban: {
          // eslint-disable-next-line camelcase
          account_number: iban,
          bic: swift,
          country,
        },
      };
    }

    const result = await createBankAccount({
      variables: {
        currency,
        bankName,
        firstName,
        lastName,
        ...countryRelatedFields,
      },
    });

    if (result.data?.bridgeXYZMutation?.success) {
      toast.success(
        <Toast
          type="success"
          title={formatText(MSG.bankDetailsConfirmed)}
          description={formatText(MSG.bankInfoAddeddSuccessfully)}
        />,
      );

      onClose();
    } else {
      // Show an error toast or something
    }
  };

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
              key: TabId.BankDetails,
              heading: {
                label: 'Bank details',
              },

              content: (
                <BankDetailsForm
                  setCurrentCurrency={setCurrentCurrency}
                  onSubmit={async (values) => {
                    const {
                      currency,
                      bankName,
                      accountOwner,
                      iban,
                      swift,
                      country,
                      accountNumber,
                      routingNumber,
                    } = values;

                    if (currency !== 'usd') {
                      handleSubmitForm({
                        currency,
                        bankName,
                        accountOwner,
                        iban,
                        swift,
                        country,
                        accountNumber,
                        routingNumber,
                      });
                    } else {
                      setBankDetailsFields((prev) => ({
                        ...prev,
                        currency,
                        bankName,
                        accountOwner,
                        iban,
                        swift,
                        country,
                        accountNumber,
                        routingNumber,
                      }));
                      setActiveTab(TabId.ContactDetails);
                    }
                  }}
                  onClose={onClose}
                />
              ),
            },
            {
              key: TabId.ContactDetails,
              heading: {
                label: 'Address details',
              },
              isHidden: currentCurrency !== 'usd',
              content: (
                <ContactDetailsForm
                  countryCode="US"
                  onSubmit={({
                    address1,
                    address2,
                    city,
                    postcode,
                    state,
                    country,
                  }) => {
                    handleSubmitForm({
                      ...bankDetailsFields,
                      address1,
                      address2,
                      city,
                      postcode,
                      state,
                      country,
                    });
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
