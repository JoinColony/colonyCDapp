import React, { useState, type FC } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { SupportedCurrencies } from '~gql';
import { formatText } from '~utils/intl.ts';
import { CloseButton } from '~v5/shared/Button/index.ts';
import ModalBase from '~v5/shared/Modal/ModalBase.tsx';

import { CURRENCY_VALUES } from '../../constants.ts';
import { BankDetailsForm } from '../BankDetailsForm/index.tsx';
import { ContactDetailsForm } from '../ContactDetailsForm/index.tsx';
import Stepper from '../Stepper/index.tsx';

import { useBankDetailsFields } from './useBankDetailsFields.tsx';

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
  bankDetailsLabel: {
    id: `${displayName}.bankDetailsLabel`,
    defaultMessage: 'Bank details',
  },
  addressDetailsLabel: {
    id: `${displayName}.addressDetailsLabel`,
    defaultMessage: 'Address details',
  },
});

const BankDetailsModal: FC<BankDetailsModalProps> = ({ isOpened, onClose }) => {
  const { formatMessage } = useIntl();
  const [activeTab, setActiveTab] = useState<TabId>(TabId.BankDetails);

  const redirectToSecondTab = () => setActiveTab(TabId.ContactDetails);

  const { bankDetailsFields, handleSubmitFirstStep, handleSubmitSecondStep } =
    useBankDetailsFields({ onClose, redirectToSecondTab });

  const stepItems = [
    {
      key: TabId.BankDetails,
      heading: { label: formatText(MSG.bankDetailsLabel) },
      content: (
        <BankDetailsForm onSubmit={handleSubmitFirstStep} onClose={onClose} />
      ),
    },
    {
      key: TabId.ContactDetails,
      heading: { label: formatText(MSG.addressDetailsLabel) },
      isHidden:
        bankDetailsFields.currency !== CURRENCY_VALUES[SupportedCurrencies.Usd],
      content: (
        <ContactDetailsForm
          onSubmit={handleSubmitSecondStep}
          onClose={onClose}
        />
      ),
    },
  ];

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
        <Stepper activeStepKey={activeTab} items={stepItems} />
      </div>
    </ModalBase>
  );
};

BankDetailsModal.displayName = displayName;
export { BankDetailsModal };
