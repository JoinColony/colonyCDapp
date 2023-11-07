import React, { useMemo } from 'react';

import { useFormContext } from 'react-hook-form';
import { ACTION, Action } from '~constants/actions';
import { useGlobalEventHandler } from '~hooks';
import SinglePaymentForm from '../partials/forms/SimplePaymentForm';
import MintTokenForm from '../partials/forms/MintTokenForm';
import TransferFundsForm from '../partials/forms/TransferFundsForm';
import CreateNewTeamForm from '../partials/forms/CreateNewTeamForm';
import UnlockTokenForm from '../partials/forms/UnlockTokenForm';
import UpgradeColonyForm from '../partials/forms/UpgradeColonyForm';
import CreateDecisionForm from '../partials/forms/CreateDecisionForm';
import EditTeamForm from '../partials/forms/EditTeamForm';
import EnterRecoveryModeForm from '../partials/forms/EnterRecoveryModeForm';
import EditColonyDetailsForm from '../partials/forms/EditColonyDetailsForm';
import ManageColonyObjectivesForm from '../partials/forms/ManageColonyObjectivesForm';
import { ACTION_TYPE_FIELD_NAME } from '../consts';
import { ActionFormBaseProps } from '../types';
import { GLOBAL_EVENTS } from '~utils/browser/dispatchGlobalEvent/consts';
import { SetActionTypeCutomEventDetail } from '~utils/browser/dispatchGlobalEvent/types';
import SplitPaymentForm from '../partials/forms/SplitPaymentForm';
import ManageTokensForm from '../partials/forms/ManageTokensForm';
import AdvancedPaymentForm from '../partials/forms/AdvancedPaymentForm';
import BatchPaymentForm from '../partials/forms/BatchPaymentForm';
import ManagePermissionsForm from '../partials/forms/ManagePermissionsForm';

export const useSidebarActionForm = () => {
  const actionFormComponents = useMemo<
    Partial<Record<Action, React.FC<ActionFormBaseProps>>>
  >(
    () => ({
      [ACTION.SIMPLE_PAYMENT]: SinglePaymentForm,
      [ACTION.MINT_TOKENS]: MintTokenForm,
      [ACTION.TRANSFER_FUNDS]: TransferFundsForm,
      [ACTION.CREATE_NEW_TEAM]: CreateNewTeamForm,
      [ACTION.UNLOCK_TOKEN]: UnlockTokenForm,
      [ACTION.UPGRADE_COLONY_VERSION]: UpgradeColonyForm,
      [ACTION.CREATE_DECISION]: CreateDecisionForm,
      [ACTION.EDIT_EXISTING_TEAM]: EditTeamForm,
      [ACTION.ENTER_RECOVERY_MODE]: EnterRecoveryModeForm,
      [ACTION.EDIT_COLONY_DETAILS]: EditColonyDetailsForm,
      [ACTION.MANAGE_COLONY_OBJECTIVES]: ManageColonyObjectivesForm,
      [ACTION.SPLIT_PAYMENT]: SplitPaymentForm,
      [ACTION.MANAGE_TOKENS]: ManageTokensForm,
      [ACTION.ADVANCED_PAYMENT]: AdvancedPaymentForm,
      [ACTION.BATCH_PAYMENT]: BatchPaymentForm,
      [ACTION.MANAGE_PERMISSIONS]: ManagePermissionsForm,
    }),
    [],
  );

  const form = useFormContext();
  const selectedAction: Action | undefined = form.watch(ACTION_TYPE_FIELD_NAME);
  const formComponent = selectedAction
    ? actionFormComponents[selectedAction]
    : undefined;

  useGlobalEventHandler<SetActionTypeCutomEventDetail>(
    GLOBAL_EVENTS.SET_ACTION_TYPE,
    (event) => {
      form.setValue(ACTION_TYPE_FIELD_NAME, event.detail.actionType);
    },
  );

  return {
    selectedAction,
    formComponent,
  };
};
