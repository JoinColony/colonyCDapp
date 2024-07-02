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

export const ACTION_TYPE_TO_API_ACTION_TYPES_MAP: Partial<
  Record<Action, AnyActionType[]>
> = {
  [Action.SimplePayment]: [
    ColonyActionType.Payment,
    ColonyActionType.PaymentMotion,
    ColonyActionType.MultiplePayment,
    ColonyActionType.MultiplePaymentMotion,
  ],
  [Action.CreateDecision]: [ColonyActionType.CreateDecisionMotion],
  [Action.TransferFunds]: [
    ColonyActionType.MoveFunds,
    ColonyActionType.MoveFundsMotion,
  ],
  [Action.MintTokens]: [
    ColonyActionType.MintTokens,
    ColonyActionType.MintTokensMotion,
  ],
  [Action.UnlockToken]: [
    ColonyActionType.UnlockToken,
    ColonyActionType.UnlockTokenMotion,
  ],
  [Action.ManageTokens]: [ColonyActionType.ManageTokens],
  [Action.CreateNewTeam]: [
    ColonyActionType.CreateDomain,
    ColonyActionType.CreateDomainMotion,
  ],
  [Action.EditExistingTeam]: [
    ColonyActionType.EditDomain,
    ColonyActionType.EditDomainMotion,
  ],
  [Action.ManagePermissions]: [
    ColonyActionType.SetUserRoles,
    ColonyActionType.SetUserRolesMotion,
  ],
  [Action.EditColonyDetails]: [
    ColonyActionType.ColonyEdit,
    ColonyActionType.ColonyEditMotion,
  ],
  [Action.UpgradeColonyVersion]: [
    ColonyActionType.VersionUpgrade,
    ColonyActionType.VersionUpgradeMotion,
  ],
  [Action.ManageColonyObjectives]: [
    ExtendedColonyActionType.UpdateColonyObjective,
  ],
  [Action.PaymentBuilder]: [ColonyActionType.CreateExpenditure],
};
