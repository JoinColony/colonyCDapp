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
    selectedAction === Actions.MINT_TOKENS;
  const shouldShowCreatedInField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.MINT_TOKENS;
  const shouldShowDecisionField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.MINT_TOKENS;
  const shouldShowDescriptionField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.MINT_TOKENS;

  return {
    shouldShowFromField,
    shouldShowUserField,
    shouldShowAmountField,
    shouldShowCreatedInField,
    shouldShowDecisionField,
    shouldShowDescriptionField,
  };
};
