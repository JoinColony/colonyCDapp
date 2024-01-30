import { FilePlus } from 'phosphor-react';
import React from 'react';

import { ColonyActionType } from '~gql';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';

import { DEFAULT_TOOLTIP_POSITION, ICON_SIZE } from '../../consts.ts';

const displayName = 'v5.common.CompletedAction.partials.ActionTypeRow';

export const actionTypeTranslations = {
  [ColonyActionType.CreateDecisionMotion]: 'actions.createDecision',
  [ColonyActionType.CreateDomain]: 'actions.createNewTeam',
  [ColonyActionType.ColonyEdit]: 'actions.editColonyDetails',
  [ColonyActionType.MintTokens]: 'actions.mintTokens',
  [ColonyActionType.Payment]: 'actions.simplePayment',
  [ColonyActionType.MoveFunds]: 'actions.transferFunds',
  [ColonyActionType.UnlockToken]: 'actions.unlockToken',
  [ColonyActionType.VersionUpgrade]: 'actions.upgradeColonyVersion',
  [ColonyActionType.VersionUpgradeMotion]: 'actions.upgradeColonyVersion',
  default: 'Action',
};

interface ActionTypeRowProps {
  actionType: ColonyActionType;
}

const ActionTypeRow = ({ actionType }: ActionTypeRowProps) => {
  return (
    <>
      <div>
        <Tooltip
          placement={DEFAULT_TOOLTIP_POSITION}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.actionType',
          })}
        >
          <div className="flex items-center gap-2">
            <FilePlus size={ICON_SIZE} />
            <span>{formatText({ id: 'actionSidebar.actionType' })}</span>
          </div>
        </Tooltip>
      </div>
      <div>
        {formatText({
          id:
            actionTypeTranslations[actionType] ||
            actionTypeTranslations.default,
        })}
      </div>
    </>
  );
};

ActionTypeRow.displayName = displayName;
export default ActionTypeRow;
