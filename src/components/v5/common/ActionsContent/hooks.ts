import { useFormContext } from 'react-hook-form';
import { Actions } from '~constants/actions';
import { useActionSidebarContext } from '~context/ActionSidebarContext';

export const useActionsContent = () => {
  const { selectedAction } = useActionSidebarContext();

  const shouldShowFromField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.TRANSFER_FUNDS ||
    selectedAction === Actions.ADVANCED_PAYMENT;
  const shouldShowUserField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.ADVANCED_PAYMENT;
  const shouldShowAmountField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.MINT_TOKENS ||
    selectedAction === Actions.TRANSFER_FUNDS;
  const shouldShowCreatedInField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.MINT_TOKENS ||
    selectedAction === Actions.TRANSFER_FUNDS ||
    selectedAction === Actions.CREATE_NEW_TEAM ||
    selectedAction === Actions.UNLOCK_TOKEN ||
    selectedAction === Actions.UPGRADE_COLONY_VERSION ||
    selectedAction === Actions.CREATE_DECISION;
  const shouldShowDecisionField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.MINT_TOKENS ||
    selectedAction === Actions.UNLOCK_TOKEN ||
    selectedAction === Actions.TRANSFER_FUNDS ||
    selectedAction === Actions.CREATE_NEW_TEAM ||
    selectedAction === Actions.CREATE_DECISION;
  const shouldShowDescriptionField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.MINT_TOKENS ||
    selectedAction === Actions.TRANSFER_FUNDS ||
    selectedAction === Actions.CREATE_NEW_TEAM ||
    selectedAction === Actions.UNLOCK_TOKEN ||
    selectedAction === Actions.UPGRADE_COLONY_VERSION ||
    selectedAction === Actions.CREATE_DECISION;
  const shouldShowTransferFundsField =
    selectedAction === Actions.TRANSFER_FUNDS;
  const shouldShowTeamPurposeField = selectedAction === Actions.CREATE_NEW_TEAM;
  const shouldShowTeamNameField = selectedAction === Actions.CREATE_NEW_TEAM;
  const shouldShowTeamColourField = selectedAction === Actions.CREATE_NEW_TEAM;
  const shouldShowVersionFields =
    selectedAction === Actions.UPGRADE_COLONY_VERSION;

  const prepareAmountTitle =
    (selectedAction === Actions.SIMPLE_PAYMENT && 'actionSidebar.amount') ||
    'actionSidebar.value';

  const methods = useFormContext();
  const isError = (fieldName: string) =>
    Object.keys(methods?.formState.errors || {}).includes(fieldName);

  return {
    shouldShowFromField,
    shouldShowUserField,
    shouldShowAmountField,
    shouldShowCreatedInField,
    shouldShowDecisionField,
    shouldShowDescriptionField,
    shouldShowTransferFundsField,
    shouldShowTeamPurposeField,
    shouldShowTeamNameField,
    shouldShowTeamColourField,
    shouldShowVersionFields,
    prepareAmountTitle,
    isError,
  };
};
