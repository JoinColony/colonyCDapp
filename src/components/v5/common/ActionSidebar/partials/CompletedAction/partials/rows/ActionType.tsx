import { FilePlus } from '@phosphor-icons/react';
import React from 'react';

import { type AnyActionType } from '~types/actions.ts';
import { formatActionType } from '~utils/colonyActions.ts';

import ActionData from './ActionData.tsx';

const displayName = 'v5.common.CompletedAction.partials.ActionTypeRow';

interface ActionTypeRowProps {
  actionType: AnyActionType;
}

const ActionTypeRow = ({ actionType }: ActionTypeRowProps) => (
  <ActionData
    rowLabel={{
      id: 'actionSidebar.actionType',
    }}
    tooltipContent={{
      id: 'actionSidebar.tooltip.actionType',
    }}
    rowContent={formatActionType(actionType)}
    RowIcon={FilePlus}
  />
);

ActionTypeRow.displayName = displayName;
export default ActionTypeRow;
