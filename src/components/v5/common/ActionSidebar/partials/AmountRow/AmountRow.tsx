import { Coins } from '@phosphor-icons/react';
import React from 'react';

import { Action } from '~constants/actions.ts';
import { formatText } from '~utils/intl.ts';
import ActionFormRow from '~v5/common/ActionFormRow/index.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import { useActiveActionType } from '~v5/common/ActionSidebar/hooks/useActiveActionType.ts';

import AmountField from '../AmountField/index.ts';

import { type AmountRowProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.AmountRow';

const AmountRow = ({ domainId, title, tooltips }: AmountRowProps) => {
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const activeActionType = useActiveActionType();

  return (
    <ActionFormRow
      icon={Coins}
      fieldName="amount"
      title={title ?? formatText({ id: 'actionSidebar.amount' })}
      tooltips={tooltips}
      isDisabled={hasNoDecisionMethods}
    >
      <AmountField
        name="amount"
        domainId={domainId}
        isDisabled={hasNoDecisionMethods}
        isTokenSelectionDisabled={activeActionType === Action.MintTokens}
      />
    </ActionFormRow>
  );
};

AmountRow.displayName = displayName;

export default AmountRow;
