import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { ActionSidebarRowFieldNameEnum } from './enums';
import { Actions } from '~constants/actions';

export const useActionSidebarRow = () => {
  const { selectedAction } = useActionSidebarContext();

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
    case Actions.SIMPLE_PAYMENT:
      return {
        [ActionSidebarRowFieldNameEnum.AMOUNT]:
          'actionSidebar.toolip.singlePaymentAmount',
        ...defaultFields,
        ...paymentFields,
      };
    case Actions.ADVANCED_PAYMENT:
      return {
        [ActionSidebarRowFieldNameEnum.AMOUNT]:
          'actionSidebar.toolip.advancedPaymentAmount',
        ...defaultFields,
        ...paymentFields,
      };
    case Actions.BATCH_PAYMENT:
      return {
        [ActionSidebarRowFieldNameEnum.AMOUNT]:
          'actionSidebar.toolip.batchPaymentAmount',
        ...defaultFields,
        ...paymentFields,
      };
    case Actions.STAGED_PAYMENT:
      return {
        [ActionSidebarRowFieldNameEnum.AMOUNT]:
          'actionSidebar.toolip.stagedPaymentAmount',
        ...defaultFields,
        ...paymentFields,
      };
    case Actions.STREAMING_PAYMENT:
      return {
        [ActionSidebarRowFieldNameEnum.AMOUNT]:
          'actionSidebar.toolip.streamingPaymentAmount',
        ...defaultFields,
      };
    case Actions.CREATE_DECISION:
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
    case Actions.TRANSFER_FUNDS:
      return {
        [ActionSidebarRowFieldNameEnum.FROM]:
          'actionSidebar.toolip.transferFunds.from',
        [ActionSidebarRowFieldNameEnum.TO]:
          'actionSidebar.toolip.transferFunds.to',
        [ActionSidebarRowFieldNameEnum.AMOUNT]:
          'actionSidebar.toolip.transferFunds.amount',
        ...defaultFields,
      };
    case Actions.MINT_TOKENS:
      return {
        [ActionSidebarRowFieldNameEnum.AMOUNT]:
          'actionSidebar.toolip.mintTokens.amount',
        ...defaultFields,
      };
    case Actions.CREATE_NEW_TEAM:
      return {
        [ActionSidebarRowFieldNameEnum.TEAM_NAME]:
          'actionSidebar.toolip.createTeam.teamName',
        [ActionSidebarRowFieldNameEnum.TEAM_PURPOSE]:
          'actionSidebar.toolip.createTeam.teamPurpose',
        [ActionSidebarRowFieldNameEnum.TEAM_COLOUR]:
          'actionSidebar.toolip.createTeam.teamColour',
        ...defaultFields,
      };
    case Actions.EDIT_EXISTING_TEAM:
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
    case Actions.EDIT_COLONY_DETAILS:
      return {
        [ActionSidebarRowFieldNameEnum.COLONY_NAME]:
          'actionSidebar.toolip.editColony.colonyName',
        [ActionSidebarRowFieldNameEnum.COLONY_LOGO]:
          'actionSidebar.toolip.editColony.colonyLogo',
        [ActionSidebarRowFieldNameEnum.COLONY_DESCRIPTION]:
          'actionSidebar.toolip.editColony.colonyDescription',
        ...defaultFields,
      };
    case Actions.UPGRADE_COLONY_VERSION:
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
