import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { CancelTransactionProps } from '../types';
import Button from '~shared/Extensions/Button';

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
          <Button
            type="button"
            mode="textButton"
            className="text-red-400"
            onClick={handleCancelTransaction}
          >
            {formatMessage({ id: 'button.yes' })}
          </Button>
          <span>/</span>
          <Button
            type="button"
            mode="textButton"
            className="text-blue-400"
            onClick={toggleCancelConfirmation}
          >
            {formatMessage({ id: 'button.no' })}
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          mode="textButton"
          onClick={toggleCancelConfirmation}
        >
          {formatMessage({ id: 'button.cancel' })}
        </Button>
      )}
    </>
  );
};

CancelTransaction.displayName = displayName;

export default CancelTransaction;
