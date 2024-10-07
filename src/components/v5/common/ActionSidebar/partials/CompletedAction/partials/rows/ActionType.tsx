import { FilePlus } from '@phosphor-icons/react';
import React from 'react';

import { type CoreAction } from '~actions/index.ts';
import { formatActionType } from '~utils/colonyActions.ts';

import ActionContent from './ActionContent.tsx';

const displayName = 'v5.common.CompletedAction.partials.ActionTypeRow';

interface ActionTypeRowProps {
  actionType: CoreAction;
}

const ActionTypeRow = ({ actionType }: ActionTypeRowProps) => (
  <ActionContent
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
