// import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { useWatch } from 'react-hook-form';
import { ActionSidebarRowFieldNameEnum } from './enums';
import { ACTION, Action } from '~constants/actions';
import { ACTION_TYPE_FIELD_NAME } from '../ActionSidebar/consts';

export const useActionSidebarRow = () => {
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });

  const defaultFields = {
    [ActionSidebarRowFieldNameEnum.DECISION_METHOD]:
      'actionSidebar.toolip.decisionMethod',
    [ActionSidebarRowFieldNameEnum.CREATED_IN]:
      'actionSidebar.toolip.createdIn',
    [ActionSidebarRowFieldNameEnum.DESCRIPTION]:
      'actionSidebar.toolip.description',
    [ActionSidebarRowFieldNameEnum.ACTION_TYPE]:
      'actionSidebar.toolip.actionType',
  };
  const paymentFields = {
    [ActionSidebarRowFieldNameEnum.FROM]: 'actionSidebar.toolip.paymentFrom',
    [ActionSidebarRowFieldNameEnum.RECIPIENT]:
      'actionSidebar.toolip.paymentRecipient',
  };

  switch (selectedAction) {
    case ACTION.SIMPLE_PAYMENT:
      return {
        [ActionSidebarRowFieldNameEnum.AMOUNT]:
          'actionSidebar.toolip.singlePaymentAmount',
        ...defaultFields,
        ...paymentFields,
      };
    case ACTION.ADVANCED_PAYMENT:
      return {
        [ActionSidebarRowFieldNameEnum.AMOUNT]:
          'actionSidebar.toolip.advancedPaymentAmount',
        ...defaultFields,
        ...paymentFields,
      };
    case ACTION.BATCH_PAYMENT:
      return {
        [ActionSidebarRowFieldNameEnum.AMOUNT]:
          'actionSidebar.toolip.batchPaymentAmount',
        ...defaultFields,
        ...paymentFields,
      };
    case ACTION.STAGED_PAYMENT:
      return {
        [ActionSidebarRowFieldNameEnum.AMOUNT]:
          'actionSidebar.toolip.stagedPaymentAmount',
        ...defaultFields,
        ...paymentFields,
      };
    case ACTION.STREAMING_PAYMENT:
      return {
        [ActionSidebarRowFieldNameEnum.AMOUNT]:
          'actionSidebar.toolip.streamingPaymentAmount',
        ...defaultFields,
      };
    case ACTION.CREATE_DECISION:
      return {
        [ActionSidebarRowFieldNameEnum.DECISION_METHOD]:
          'actionSidebar.toolip.decisionMethod',
        [ActionSidebarRowFieldNameEnum.CREATED_IN]:
          'actionSidebar.toolip.createdIn',
        [ActionSidebarRowFieldNameEnum.DESCRIPTION]:
          'actionSidebar.toolip.createDecision.description',
        [ActionSidebarRowFieldNameEnum.ACTION_TYPE]:
          'actionSidebar.toolip.actionType',
      };
    case ACTION.TRANSFER_FUNDS:
      return {
        [ActionSidebarRowFieldNameEnum.FROM]:
          'actionSidebar.toolip.transferFunds.from',
        [ActionSidebarRowFieldNameEnum.TO]:
          'actionSidebar.toolip.transferFunds.to',
        [ActionSidebarRowFieldNameEnum.AMOUNT]:
          'actionSidebar.toolip.transferFunds.amount',
        ...defaultFields,
      };
    case ACTION.MINT_TOKENS:
      return {
        [ActionSidebarRowFieldNameEnum.AMOUNT]:
          'actionSidebar.toolip.mintTokens.amount',
        ...defaultFields,
      };
    case ACTION.CREATE_NEW_TEAM:
      return {
        [ActionSidebarRowFieldNameEnum.TEAM_NAME]:
          'actionSidebar.toolip.createTeam.teamName',
        [ActionSidebarRowFieldNameEnum.TEAM_PURPOSE]:
          'actionSidebar.toolip.createTeam.teamPurpose',
        [ActionSidebarRowFieldNameEnum.TEAM_COLOUR]:
          'actionSidebar.toolip.createTeam.teamColour',
        ...defaultFields,
      };
    case ACTION.EDIT_EXISTING_TEAM:
      return {
        [ActionSidebarRowFieldNameEnum.FROM]:
          'actionSidebar.toolip.editTeam.selectTeam',
        [ActionSidebarRowFieldNameEnum.TEAM_NAME]:
          'actionSidebar.toolip.editTeam.teamName',
        [ActionSidebarRowFieldNameEnum.TEAM_PURPOSE]:
          'actionSidebar.toolip.createTeam.teamPurpose',
        [ActionSidebarRowFieldNameEnum.TEAM_COLOUR]:
          'actionSidebar.toolip.createTeam.teamColour',
        ...defaultFields,
      };
    case ACTION.EDIT_COLONY_DETAILS:
      return {
        [ActionSidebarRowFieldNameEnum.COLONY_NAME]:
          'actionSidebar.toolip.editColony.colonyName',
        [ActionSidebarRowFieldNameEnum.COLONY_LOGO]:
          'actionSidebar.toolip.editColony.colonyLogo',
        [ActionSidebarRowFieldNameEnum.COLONY_DESCRIPTION]:
          'actionSidebar.toolip.editColony.colonyDescription',
        ...defaultFields,
      };
    case ACTION.UPGRADE_COLONY_VERSION:
      return {
        [ActionSidebarRowFieldNameEnum.CURRENT_VERSION]:
          'actionSidebar.toolip.upgradeColonyVersion.currentVersion',
        [ActionSidebarRowFieldNameEnum.NEW_VERSION]:
          'actionSidebar.toolip.upgradeColonyVersion.newVersion',
        ...defaultFields,
      };
    default:
      return {
        [ActionSidebarRowFieldNameEnum.ACTION_TYPE]:
          'actionSidebar.toolip.actionType',
      };
  }
};
