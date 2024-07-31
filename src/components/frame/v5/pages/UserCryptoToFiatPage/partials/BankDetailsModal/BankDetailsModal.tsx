import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { type BridgeBankAccount } from '~types/graphql.ts';
import { CloseButton } from '~v5/shared/Button/index.ts';
import ModalBase from '~v5/shared/Modal/ModalBase.tsx';

import BankDetailsForm from '../BankDetailsForm/index.ts';
import ContactDetailsForm from '../ContactDetailsForm/index.ts';

import { useBankDetailsFields } from './useBankDetailsFields.tsx';

interface BankDetailsModalProps {
  isOpened: boolean;
  onClose: () => void;
  data?: BridgeBankAccount | null;
}

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.BankDetailsModal';

const BankDetailsModal: FC<BankDetailsModalProps> = ({
  isOpened,
  onClose,
  data,
}) => {
  const { formatMessage } = useIntl();

  const {
    isLoading,
    bankDetailsFields,
    showContactDetailsForm,
    handleSubmitFirstStep,
    handleSubmitSecondStep,
  } = useBankDetailsFields({
    onClose,
    data,
  });

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
      <div className="px-6 pb-6 pt-16">
        {!showContactDetailsForm ? (
          <BankDetailsForm
            onSubmit={handleSubmitFirstStep}
            onClose={onClose}
            defaultValues={bankDetailsFields}
            isLoading={isLoading}
          />
        ) : (
          <ContactDetailsForm
            onSubmit={handleSubmitSecondStep}
            onClose={onClose}
            isLoading={isLoading}
          />
        )}
      </div>
    </ModalBase>
  );
};

BankDetailsModal.displayName = displayName;

export default BankDetailsModal;
