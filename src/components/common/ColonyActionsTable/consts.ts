import { ACTION, Action } from '~constants/actions';
import { ColonyActionType } from '~gql';
import { AnyActionType, ExtendedColonyActionType } from '~types';
import { MotionState } from '~utils/colonyMotions';

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
];

export const ACTION_TYPE_TO_API_ACTION_TYPES_MAP: Partial<
  Record<Action, AnyActionType[]>
> = {
  [ACTION.SIMPLE_PAYMENT]: [
    ColonyActionType.Payment,
    ColonyActionType.PaymentMotion,
    ColonyActionType.MultiplePayment,
    ColonyActionType.MultiplePaymentMotion,
  ],
  [ACTION.CREATE_DECISION]: [ColonyActionType.CreateDecisionMotion],
  [ACTION.TRANSFER_FUNDS]: [
    ColonyActionType.MoveFunds,
    ColonyActionType.MoveFundsMotion,
  ],
  [ACTION.MINT_TOKENS]: [
    ColonyActionType.MintTokens,
    ColonyActionType.MintTokensMotion,
  ],
  [ACTION.UNLOCK_TOKEN]: [
    ColonyActionType.UnlockToken,
    ColonyActionType.UnlockTokenMotion,
  ],
  [ACTION.MANAGE_TOKENS]: [ExtendedColonyActionType.UpdateTokens],
  [ACTION.CREATE_NEW_TEAM]: [
    ColonyActionType.CreateDomain,
    ColonyActionType.CreateDomainMotion,
  ],
  [ACTION.EDIT_EXISTING_TEAM]: [
    ColonyActionType.EditDomain,
    ColonyActionType.EditDomainMotion,
  ],
  [ACTION.MANAGE_PERMISSIONS]: [
    ColonyActionType.SetUserRoles,
    ColonyActionType.SetUserRolesMotion,
  ],
  [ACTION.EDIT_COLONY_DETAILS]: [
    ColonyActionType.ColonyEdit,
    ColonyActionType.ColonyEditMotion,
  ],
  [ACTION.UPGRADE_COLONY_VERSION]: [
    ColonyActionType.VersionUpgrade,
    ColonyActionType.VersionUpgradeMotion,
  ],
  [ACTION.MANAGE_COLONY_OBJECTIVES]: [
    ExtendedColonyActionType.UpdateColonyObjective,
  ],
};
