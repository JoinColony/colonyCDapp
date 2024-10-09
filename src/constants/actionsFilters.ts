import { ColonyActionType } from '~gql';
import {
  type AnyActionType,
  ExtendedColonyActionType,
} from '~types/actions.ts';
import { MotionState } from '~utils/colonyMotions.ts';

import { Action } from './actions.ts';

export const FILTER_MOTION_STATES = [
  MotionState.Staking,
  MotionState.Supported,
  MotionState.Opposed,
  MotionState.Escalated,
  MotionState.Voting,
  MotionState.Reveal,
  MotionState.Finalizable,
  MotionState.Passed,
  MotionState.Failed,
  MotionState.Open,
  MotionState.Rejected,
];

// FIXME: @RESOLUTION THIS CAN BE REMOVED ONCE the xxxMotion and xxxMultisig
// are removed
export const ACTION_TYPE_TO_API_ACTION_TYPES_MAP: Partial<
  Record<Action, AnyActionType[]>
> = {
  [Action.SimplePayment]: [
    ColonyActionType.Payment,
    ColonyActionType.PaymentMotion,
    ColonyActionType.MultiplePayment,
    ColonyActionType.MultiplePaymentMotion,
    ColonyActionType.PaymentMultisig,
    ColonyActionType.MultiplePaymentMultisig,
  ],
  [Action.CreateDecision]: [ColonyActionType.CreateDecisionMotion],
  [Action.TransferFunds]: [
    ColonyActionType.MoveFunds,
    ColonyActionType.MoveFundsMotion,
    ColonyActionType.MoveFundsMultisig,
  ],
  [Action.MintTokens]: [
    ColonyActionType.MintTokens,
    ColonyActionType.MintTokensMotion,
    ColonyActionType.MintTokensMultisig,
  ],
  [Action.UnlockToken]: [
    ColonyActionType.UnlockToken,
    ColonyActionType.UnlockTokenMotion,
    ColonyActionType.UnlockTokenMultisig,
  ],
  [Action.ManageTokens]: [
    ColonyActionType.ManageTokens,
    ColonyActionType.ManageTokensMotion,
    ColonyActionType.ManageTokensMultisig,
  ],
  [Action.CreateNewTeam]: [
    ColonyActionType.CreateDomain,
    ColonyActionType.CreateDomainMotion,
    ColonyActionType.CreateDomainMultisig,
  ],
  [Action.EditExistingTeam]: [
    ColonyActionType.EditDomain,
    ColonyActionType.EditDomainMotion,
    ColonyActionType.EditDomainMultisig,
  ],
  [Action.ManagePermissions]: [
    ColonyActionType.SetUserRoles,
    ColonyActionType.SetUserRolesMotion,
    ColonyActionType.SetUserRolesMultisig,
  ],
  [Action.EditColonyDetails]: [
    ColonyActionType.ColonyEdit,
    ColonyActionType.ColonyEditMotion,
    ColonyActionType.ColonyEditMultisig,
  ],
  [Action.UpgradeColonyVersion]: [
    ColonyActionType.VersionUpgrade,
    ColonyActionType.VersionUpgradeMotion,
    ColonyActionType.VersionUpgradeMultisig,
  ],
  /**
   * @deprecated
   * This is still being used by our filters context for some components to filter by Colony Objectives Action type
   */
  [Action.ManageColonyObjectives]: [
    ExtendedColonyActionType.UpdateColonyObjective,
    ExtendedColonyActionType.UpdateColonyObjectiveMotion,
    ExtendedColonyActionType.UpdateColonyObjectiveMultisig,
  ],
  [Action.PaymentBuilder]: [ColonyActionType.CreateExpenditure],
};
