import React, { type FC, useCallback, useState } from 'react';

import { getGroupId } from '../transactionGroup.ts';
import { type TransactionDetailsProps } from '../types.ts';

import GroupedTransaction from './GroupedTransaction.tsx';

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
        onToggleExpand={handleSelectElement}
        isContentOpened={groupId === getGroupId(transactionGroup)}
      />
    </ul>
  );
};

TransactionDetails.displayName = displayName;

export default TransactionDetails;
