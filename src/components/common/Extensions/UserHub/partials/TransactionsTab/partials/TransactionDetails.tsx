import React, { FC, useCallback, useState } from 'react';

import { getGroupId } from '~frame/GasStation/transactionGroup';

import GroupedTransaction from './GroupedTransaction';
import { TransactionDetailsProps } from '../types';

const displayName =
  'common.Extensions.UserHub.partials.TransactionTab.partials.TransactionDetails';

const TransactionDetails: FC<TransactionDetailsProps> = ({
  transactionGroup,
}) => {
  const [groupId, setGroupId] = useState<string | undefined>();

  const handleSelectElement = useCallback((id: string) => {
    setGroupId(id);
  }, []);

  return (
    <ul>
      <GroupedTransaction
        transactionGroup={transactionGroup}
        onClick={handleSelectElement}
        isContentOpened={groupId === getGroupId(transactionGroup)}
      />
    </ul>
  );
};

TransactionDetails.displayName = displayName;

export default TransactionDetails;
