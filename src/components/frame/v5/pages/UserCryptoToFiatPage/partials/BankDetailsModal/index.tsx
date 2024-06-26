import React, { useEffect, useState, type FC } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import {
  useCreateKycLinksMutation,
  useUpdateBridgeCustomerMutation,
} from '~gql';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import { type CountryData } from '~utils/countries.ts';
import { formatText } from '~utils/intl.ts';
import { CloseButton } from '~v5/shared/Button/index.ts';
import ModalBase from '~v5/shared/Modal/ModalBase.tsx';

import { BankDetailsForm } from '../BankDetailsForm/index.tsx';
import { ContactDetailsForm } from '../ContactDetailsForm/index.tsx';
import ModalHeading from '../ModalHeading/ModalHeading.tsx';
import { PersonalDetailsForm } from '../PersonalDetailsForm/index.tsx';
import Stepper from '../Stepper/index.tsx';

interface BankDetailsModalProps {
  isOpened: boolean;
  onClose: () => void;
}

enum TabId {
  PersonalDetails = 0,
  Terms = 1,
  ContactDetails = 2,
  BankDetails = 3,
}

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.BankDetailsModal';

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
  bankDetailsConfirmed: {
    id: `${displayName}.bankDetailsConfirmed`,
    defaultMessage: 'Bank details confirmed',
  },
  bankInfoAddeddSuccessfully: {
    id: `${displayName}.bankInfoAddeddSuccessfully`,
    defaultMessage: 'Your information has been added sucessfully',
  },
});

export const BankDetailsModal: FC<BankDetailsModalProps> = ({ isOpened, onClose }) => {
  const { formatMessage } = useIntl();

  const [activeTab, setActiveTab] = useState<TabId>(TabId.PersonalDetails);

  const [kycFields, setKycFields] = useState<{
    signedAgreementId: string;
    birthDate: string;
    firstName: string;
    lastName: string;
    taxIdNumber: string;
    tosLink: string;
    email: string;
    address: {
      city: string;
      country: string;
      postcode: string;
      state: string;
      address1: string;
      address2: string;
    };
  }>({
    email: '',
    signedAgreementId: '',
    birthDate: '',
    firstName: '',
    lastName: '',
    taxIdNumber: '',
    tosLink: '',
    address: {
      city: '',
      country: '',
      postcode: '',
      state: '',
      address1: '',
      address2: '',
    },
  });

  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null,
  );

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

  const [createKycLinks] = useCreateKycLinksMutation();

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
              key: TabId.PersonalDetails,
              heading: {
                label: 'Personal details',
              },

              content: (
                <div>
                  <PersonalDetailsForm
                    setSelectedCountry={setSelectedCountry}
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
                          address: {
                            ...state.address,
                            country,
                          },
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
              key: TabId.ContactDetails,
              heading: {
                label: 'Contact details',
              },
              content: (
                <ContactDetailsForm
                  selectedCountry={selectedCountry}
                  onSubmit={({
                    tax,
                    date: birthDate,
                    address1,
                    address2,
                    city,
                    postcode,
                  }) => {
                    setKycFields((state) => ({
                      ...state,
                      taxIdNumber: tax,
                      birthDate,
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
                      firstName,
                      lastName,
                      taxIdNumber,
                      email,
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
                        firstName,
                        lastName,
                        taxIdNumber,
                        email,
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