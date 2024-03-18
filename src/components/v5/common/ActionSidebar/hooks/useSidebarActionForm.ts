import { type FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { Action } from '~constants/actions.ts';

import { ACTION_TYPE_FIELD_NAME } from '../consts.ts';
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

const useSidebarActionForm = () => {
  const actionFormComponents = useMemo<
    Partial<Record<Action, FC<ActionFormBaseProps>>>
  >(
    () => ({
      [Action.SimplePayment]: SinglePaymentForm,
      [Action.MintTokens]: MintTokenForm,
      [Action.TransferFunds]: TransferFundsForm,
      [Action.CreateNewTeam]: CreateNewTeamForm,
      [Action.UnlockToken]: UnlockTokenForm,
      [Action.UpgradeColonyVersion]: UpgradeColonyForm,
      [Action.CreateDecision]: CreateDecisionForm,
      [Action.EditExistingTeam]: EditTeamForm,
      [Action.EnterRecoveryMode]: EnterRecoveryModeForm,
      [Action.EditColonyDetails]: EditColonyDetailsForm,
      [Action.ManageColonyObjectives]: ManageColonyObjectivesForm,
      [Action.SplitPayment]: SplitPaymentForm,
      [Action.ManageTokens]: ManageTokensForm,
      [Action.AdvancedPayment]: AdvancedPaymentForm,
      [Action.BatchPayment]: BatchPaymentForm,
      [Action.ManagePermissions]: ManagePermissionsForm,
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

export default useSidebarActionForm;
