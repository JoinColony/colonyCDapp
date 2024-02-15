import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { Action } from '~constants/actions.ts';

import { ACTION_TYPE_FIELD_NAME } from '../consts.tsx';
import AdvancedPaymentForm from '../partials/forms/AdvancedPaymentForm/index.ts';
import BatchPaymentForm from '../partials/forms/BatchPaymentForm/index.ts';
import CreateDecisionForm from '../partials/forms/CreateDecisionForm/index.ts';
import CreateNewTeamForm from '../partials/forms/CreateNewTeamForm/index.ts';
import EditColonyDetailsForm from '../partials/forms/EditColonyDetailsForm/index.ts';
import EditTeamForm from '../partials/forms/EditTeamForm/index.ts';
import EnterRecoveryModeForm from '../partials/forms/EnterRecoveryModeForm/index.ts';
import ManageColonyObjectivesForm from '../partials/forms/ManageColonyObjectivesForm/index.ts';
import ManagePermissionsForm from '../partials/forms/ManagePermissionsForm/index.ts';
import ManageTokensForm from '../partials/forms/ManageTokensForm/index.ts';
import MintTokenForm from '../partials/forms/MintTokenForm/index.ts';
import SinglePaymentForm from '../partials/forms/SimplePaymentForm/index.ts';
import SplitPaymentForm from '../partials/forms/SplitPaymentForm/index.ts';
import TransferFundsForm from '../partials/forms/TransferFundsForm/index.ts';
import UnlockTokenForm from '../partials/forms/UnlockTokenForm/index.ts';
import UpgradeColonyForm from '../partials/forms/UpgradeColonyForm/index.ts';
import { type ActionFormBaseProps } from '../types.ts';

import type React from 'react';

export const useSidebarActionForm = () => {
  const actionFormComponents = useMemo<
    Partial<Record<Action, React.FC<ActionFormBaseProps>>>
  >(
    () => ({
      [Action.SIMPLE_PAYMENT]: SinglePaymentForm,
      [Action.MINT_TOKENS]: MintTokenForm,
      [Action.TRANSFER_FUNDS]: TransferFundsForm,
      [Action.CREATE_NEW_TEAM]: CreateNewTeamForm,
      [Action.UNLOCK_TOKEN]: UnlockTokenForm,
      [Action.UPGRADE_COLONY_VERSION]: UpgradeColonyForm,
      [Action.CREATE_DECISION]: CreateDecisionForm,
      [Action.EDIT_EXISTING_TEAM]: EditTeamForm,
      [Action.ENTER_RECOVERY_MODE]: EnterRecoveryModeForm,
      [Action.EDIT_COLONY_DETAILS]: EditColonyDetailsForm,
      [Action.MANAGE_COLONY_OBJECTIVES]: ManageColonyObjectivesForm,
      [Action.SPLIT_PAYMENT]: SplitPaymentForm,
      [Action.MANAGE_TOKENS]: ManageTokensForm,
      [Action.ADVANCED_PAYMENT]: AdvancedPaymentForm,
      [Action.BATCH_PAYMENT]: BatchPaymentForm,
      [Action.MANAGE_PERMISSIONS]: ManagePermissionsForm,
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
