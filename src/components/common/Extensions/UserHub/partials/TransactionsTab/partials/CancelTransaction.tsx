import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { CancelTransactionProps } from '../types';
import TextButton from '~v5/shared/Button/TextButton';

const displayName =
  'common.Extensions.UserHub.partials.TransactionsTab.partials.CancelTransaction';

const CancelTransaction: FC<CancelTransactionProps> = ({
  isShowingCancelConfirmation,
  handleCancelTransaction,
  toggleCancelConfirmation,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      {isShowingCancelConfirmation ? (
        <div className="flex gap-2">
          <TextButton
            type="button"
            className="text-red-400"
            onClick={handleCancelTransaction}
          >
            {formatMessage({ id: 'button.yes' })}
          </TextButton>
          <span>/</span>
          <TextButton
            type="button"
            className="text-blue-400"
            onClick={toggleCancelConfirmation}
          >
            {formatMessage({ id: 'button.no' })}
          </TextButton>
        </div>
      ) : (
        <TextButton type="button" onClick={toggleCancelConfirmation}>
          {formatMessage({ id: 'button.cancel' })}
        </TextButton>
      )}
    </>
  );
};

CancelTransaction.displayName = displayName;

export default CancelTransaction;
