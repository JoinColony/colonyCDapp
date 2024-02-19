import { FilePlus } from '@phosphor-icons/react';
import React from 'react';

import { ColonyActionType } from '~gql';
import { formatText } from '~utils/intl.ts';

import ActionData from './ActionData.tsx';

const displayName = 'v5.common.CompletedAction.partials.ActionTypeRow';

export const actionTypeTranslations = {
  [ColonyActionType.CreateDecisionMotion]: 'actions.createDecision',
  [ColonyActionType.CreateDomain]: 'actions.createNewTeam',
  [ColonyActionType.CreateDomainMotion]: 'actions.createNewTeam',
  [ColonyActionType.EditDomain]: 'actions.editExistingTeam',
  [ColonyActionType.EditDomainMotion]: 'actions.editExistingTeam',
  [ColonyActionType.ColonyEdit]: 'actions.editColonyDetails',
  [ColonyActionType.MintTokens]: 'actions.mintTokens',
  [ColonyActionType.MintTokensMotion]: 'actions.mintTokens',
  [ColonyActionType.Payment]: 'actions.simplePayment',
  [ColonyActionType.PaymentMotion]: 'actions.simplePayment',
  [ColonyActionType.MoveFunds]: 'actions.transferFunds',
  [ColonyActionType.MoveFundsMotion]: 'actions.transferFunds',
  [ColonyActionType.UnlockToken]: 'actions.unlockToken',
  [ColonyActionType.VersionUpgrade]: 'actions.upgradeColonyVersion',
  [ColonyActionType.VersionUpgradeMotion]: 'actions.upgradeColonyVersion',
  [ColonyActionType.SetUserRoles]: 'actions.managePermissions',
  [ColonyActionType.SetUserRolesMotion]: 'actions.managePermissions',
  default: 'Action',
};

interface ActionTypeRowProps {
  actionType: ColonyActionType;
}

const ActionTypeRow = ({ actionType }: ActionTypeRowProps) => (
  <ActionData
    rowLabel={{
      id: 'actionSidebar.actionType',
    }}
    tooltipContent={{
      id: 'actionSidebar.tooltip.actionType',
    }}
    rowContent={formatText({
      id: actionTypeTranslations[actionType] || actionTypeTranslations.default,
    })}
    RowIcon={FilePlus}
  />
);

ActionTypeRow.displayName = displayName;
export default ActionTypeRow;
