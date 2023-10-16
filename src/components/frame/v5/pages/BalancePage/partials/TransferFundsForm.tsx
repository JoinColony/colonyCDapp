import React, { FC } from 'react';
import { ActionForm } from '~shared/Fields';
import TokenAmountInput from '~common/Dialogs/TokenAmountInput';
import { TransferFundsFormValues, validationSchema } from './consts';
import { useTransferFunds } from './hooks';

export const displayName = 'v5.pages.BalancePage.partials.TransferFundsForm';

const TransferFundsForm: FC = () => {
  const {
    defaultFromDomainId,
    defaultToDomainId,
    actionType,
    transform,
    colony,
  } = useTransferFunds();

  if (!colony) {
    return null;
  }

  const handleSuccess = () => {
    console.log('success');
  }

  return (
    <ActionForm<TransferFundsFormValues>
      defaultValues={{
        forceAction: false,
        fromDomainId: defaultFromDomainId,
        toDomainId: defaultToDomainId,
        amount: 0,
        tokenAddress: colony?.nativeToken.tokenAddress,
      }}
      validationSchema={validationSchema}
      actionType={actionType}
      transform={transform}
      onSuccess={handleSuccess}
    >
      <TokenAmountInput colony={colony} />
      <button type='submit'>submit</button>
    </ActionForm>
  );
};

TransferFundsForm.displayName = displayName;

export default TransferFundsForm;
