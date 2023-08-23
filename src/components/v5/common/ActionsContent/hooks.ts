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
    selectedAction === Actions.UNLOCK_TOKEN ||
    selectedAction === Actions.UPGRADE_COLONY_VERSION ||
    selectedAction === Actions.TRANSFER_FUNDS;
  const shouldShowDecisionField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.MINT_TOKENS ||
    selectedAction === Actions.UNLOCK_TOKEN ||
    selectedAction === Actions.UPGRADE_COLONY_VERSION ||
    selectedAction === Actions.TRANSFER_FUNDS;
  const shouldShowDescriptionField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.MINT_TOKENS ||
    selectedAction === Actions.UNLOCK_TOKEN ||
    selectedAction === Actions.UPGRADE_COLONY_VERSION ||
    selectedAction === Actions.TRANSFER_FUNDS;
  const shouldShowTransferFundsField =
    selectedAction === Actions.TRANSFER_FUNDS;
  const shouldShowVersionFields =
    selectedAction === Actions.UPGRADE_COLONY_VERSION;

  return {
    shouldShowFromField,
    shouldShowUserField,
    shouldShowAmountField,
    shouldShowCreatedInField,
    shouldShowDecisionField,
    shouldShowDescriptionField,
    shouldShowTransferFundsField,
    shouldShowVersionFields,
  };
};
