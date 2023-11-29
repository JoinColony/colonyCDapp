import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ACTION, Action } from '~constants/actions';

import { ACTION_TYPE_FIELD_NAME } from '../consts';
import AdvancedPaymentForm from '../partials/forms/AdvancedPaymentForm';
import BatchPaymentForm from '../partials/forms/BatchPaymentForm';
import CreateDecisionForm from '../partials/forms/CreateDecisionForm';
import CreateNewTeamForm from '../partials/forms/CreateNewTeamForm';
import EditColonyDetailsForm from '../partials/forms/EditColonyDetailsForm';
import EditTeamForm from '../partials/forms/EditTeamForm';
import EnterRecoveryModeForm from '../partials/forms/EnterRecoveryModeForm';
import ManageColonyObjectivesForm from '../partials/forms/ManageColonyObjectivesForm';
import ManagePermissionsForm from '../partials/forms/ManagePermissionsForm';
import ManageTokensForm from '../partials/forms/ManageTokensForm';
import MintTokenForm from '../partials/forms/MintTokenForm';
import SimplePaymentForm from '../partials/forms/SimplePaymentForm';
import SplitPaymentForm from '../partials/forms/SplitPaymentForm';
import TransferFundsForm from '../partials/forms/TransferFundsForm';
import UnlockTokenForm from '../partials/forms/UnlockTokenForm';
import UpgradeColonyForm from '../partials/forms/UpgradeColonyForm';
import { ActionFormBaseProps } from '../types';

export const useSidebarActionForm = () => {
  const actionFormComponents = useMemo<
    Partial<Record<Action, React.FC<ActionFormBaseProps>>>
  >(
    () => ({
      [ACTION.SIMPLE_PAYMENT]: SimplePaymentForm,
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

  return {
    selectedAction,
    formComponent,
  };
};
