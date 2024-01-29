import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ACTION, type Action } from '~constants/actions.ts';

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

  return {
    selectedAction,
    formComponent,
  };
};
