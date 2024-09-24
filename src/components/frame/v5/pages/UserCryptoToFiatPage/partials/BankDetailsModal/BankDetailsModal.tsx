import React, { type FC } from 'react';

import { type BridgeBankAccount } from '~types/graphql.ts';
import Modal from '~v5/shared/Modal/Modal.tsx';

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
    <Modal
      isFullOnMobile={false}
      isOpen={isOpened}
      onClose={onClose}
      withPaddingBottom
    >
      <div className="pt-10">
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
    </Modal>
  );
};

BankDetailsModal.displayName = displayName;

export default BankDetailsModal;
