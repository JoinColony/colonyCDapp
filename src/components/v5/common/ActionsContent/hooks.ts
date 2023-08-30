import { useFormContext } from 'react-hook-form';
import { Actions } from '~constants/actions';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { DomainColor } from '~gql';
import { useColonyContext } from '~hooks';

export const useActionsContent = () => {
  const { selectedAction } = useActionSidebarContext();

  const shouldShowFromField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.TRANSFER_FUNDS ||
    selectedAction === Actions.ADVANCED_PAYMENT ||
    selectedAction === Actions.EDIT_EXISTING_TEAM;
  const shouldShowUserField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.ADVANCED_PAYMENT;
  const shouldShowAmountField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.MINT_TOKENS ||
    selectedAction === Actions.TRANSFER_FUNDS;
  const shouldShowTransferFundsField =
    selectedAction === Actions.TRANSFER_FUNDS;
  const shouldShowTeamPurposeField =
    selectedAction === Actions.CREATE_NEW_TEAM ||
    selectedAction === Actions.EDIT_EXISTING_TEAM;
  const shouldShowTeamNameField =
    selectedAction === Actions.CREATE_NEW_TEAM ||
    selectedAction === Actions.EDIT_EXISTING_TEAM;
  const shouldShowTeamColourField =
    selectedAction === Actions.CREATE_NEW_TEAM ||
    selectedAction === Actions.EDIT_EXISTING_TEAM;
  const shouldShowVersionFields =
    selectedAction === Actions.UPGRADE_COLONY_VERSION;
  const shouldShowColonyDetailsFields =
    selectedAction === Actions.EDIT_COLONY_DETAILS;

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
    shouldShowTransferFundsField,
    shouldShowTeamPurposeField,
    shouldShowTeamNameField,
    shouldShowTeamColourField,
    shouldShowVersionFields,
    shouldShowColonyDetailsFields,
    prepareAmountTitle,
    isError,
  };
};

export const useGetTeamValues = (teamId: number) => {
  const { colony } = useColonyContext();
  const { domains } = colony || {};

  const team = domains?.items?.find((domain) => domain?.nativeId === teamId);
  const { metadata } = team || {};

  return {
    teamName: metadata?.name || '',
    teamPurpose: metadata?.description || '',
    teamColor: metadata?.color || DomainColor.LightPink,
  };
};
