import { Coins } from '@phosphor-icons/react';
import React from 'react';

import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';

import { useHasActionPermissions } from '../../hooks/index.ts';
import AmountField from '../AmountField/index.ts';

import { type AmountRowProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.AmountRow';

const AmountRow = ({
  tokenAddress,
  domainId,
  title,
  tooltips,
}: AmountRowProps) => {
  const hasPermissions = useHasActionPermissions();

  return (
    <ActionFormRow
      icon={Coins}
      fieldName="amount"
      title={title ?? formatText({ id: 'actionSidebar.amount' })}
      tooltips={tooltips}
      isDisabled={hasPermissions === false}
    >
      <AmountField
        name="amount"
        maxWidth={270}
        tokenAddress={tokenAddress}
        domainId={domainId}
        isDisabled={hasPermissions === false}
      />
    </ActionFormRow>
  );
};

AmountRow.displayName = displayName;

export default AmountRow;
