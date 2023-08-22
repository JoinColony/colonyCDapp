import { useEffect, useState } from 'react';
import { Actions } from '~constants/actions';
import { useActionSidebarContext } from '~context/ActionSidebarContext';

export const useGetSubmitButton = () => {
  const { selectedAction } = useActionSidebarContext();
  const [submitButtonText, setSubmitButtonText] = useState(
    'button.createAction',
  );

  useEffect(() => {
    switch (selectedAction) {
      case Actions.ADVANCED_PAYMENT:
      case Actions.SIMPLE_PAYMENT:
      case Actions.BATCH_PAYMENT:
      case Actions.SPLIT_PAYMENT:
      case Actions.STAGED_PAYMENT:
        setSubmitButtonText('button.createPayment');
        break;
      case Actions.STREAMING_PAYMENT:
        setSubmitButtonText('button.createStream');
        break;
      case Actions.TRANSFER_FUNDS:
        setSubmitButtonText('button.createTransfer');
        break;
      case Actions.MINT_TOKENS:
        setSubmitButtonText('button.createTokens');
        break;
      case Actions.UNLOCK_TOKEN:
        setSubmitButtonText('button.unlockToken');
        break;
      case Actions.MANAGE_TOKENS:
        setSubmitButtonText('button.updateTokens');
        break;
      case Actions.EDIT_COLONY_DETAILS:
        setSubmitButtonText('button.editDetails');
        break;
      case Actions.EDIT_EXISTING_TEAM:
        setSubmitButtonText('button.editTeam');
        break;
      case Actions.CREATE_NEW_TEAM:
        setSubmitButtonText('button.createTeam');
        break;
      case Actions.AWARD_REPUTATION:
        setSubmitButtonText('button.changeReputation');
        break;
      case Actions.MANAGE_PERMISSIONS:
        setSubmitButtonText('button.changePermissions');
        break;
      case Actions.UPGRADE_COLONY_VERSION:
        setSubmitButtonText('button.upgradeVersion');
        break;
      case Actions.ENTER_RECOVERY_MODE:
        setSubmitButtonText('button.enterRecovery');
        break;
      case Actions.MANAGE_COLONY_OBJECTIVES:
        setSubmitButtonText('button.updateObjective');
        break;
      case Actions.CREATE_NEW_INTEGRATION:
        setSubmitButtonText('button.createIntegration');
        break;
      default:
        setSubmitButtonText('button.createAction');
        break;
    }
  }, [selectedAction]);

  return submitButtonText;
};
