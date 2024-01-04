import { FilePlus } from 'phosphor-react';
import React from 'react';

import { ColonyActionType } from '~gql';
import Tooltip from '~shared/Extensions/Tooltip';
import { formatText } from '~utils/intl';

import { ICON_SIZE } from '../../consts';

const displayName = 'v5.common.CompletedAction.partials.ActionTypeRow';

interface ActionTypeRowProps {
  actionType: ColonyActionType;
}

const ActionTypeRow = ({ actionType }: ActionTypeRowProps) => {
  return (
    <>
      <div>
        <Tooltip
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.simplePayment.actionType',
          })}
        >
          <div className="flex items-center gap-2">
            <FilePlus size={ICON_SIZE} />
            <span>{formatText({ id: 'actionSidebar.actionType' })}</span>
          </div>
        </Tooltip>
      </div>
      <div>{formatText(actionType)}</div>
    </>
  );
};

ActionTypeRow.displayName = displayName;
export default ActionTypeRow;
