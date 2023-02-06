import { ColonyRole } from '@colony/colony-js';

import {
  ColonyActionType,
  ColonyAndExtensionsEvents,
  ColonyMotions,
} from '~types';

export enum TransactionStatuses {
  Failed = 'failed',
  Pending = 'pending',
  Succeeded = 'succeeded',
  SystemMessage = 'systemMessage',
}

/*
 * Transaction statuses
 */
export const STATUS_MAP: { [k: number]: TransactionStatuses } = {
  0: TransactionStatuses.Failed,
  1: TransactionStatuses.Succeeded,
  2: TransactionStatuses.Pending,
};

type EventRolesMap = Partial<{
  [key in ColonyAndExtensionsEvents]: ColonyRole[];
}>;

type ActionsEventsMap = Partial<{
  [key in ColonyActionType | ColonyMotions]: ColonyAndExtensionsEvents[];
}>;

export const EVENT_ROLES_MAP: EventRolesMap = {
  [ColonyAndExtensionsEvents.OneTxPaymentMade]: [
    ColonyRole.Administration,
    ColonyRole.Funding,
  ],
  [ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots]: [
    ColonyRole.Funding,
  ],
  [ColonyAndExtensionsEvents.TokenUnlocked]: [ColonyRole.Root],
  [ColonyAndExtensionsEvents.TokensMinted]: [ColonyRole.Root],
  [ColonyAndExtensionsEvents.DomainAdded]: [ColonyRole.Architecture],
  [ColonyAndExtensionsEvents.DecisionCreated]: [ColonyRole.Root],
  [ColonyAndExtensionsEvents.ColonyUpgraded]: [ColonyRole.Root],
  [ColonyAndExtensionsEvents.ColonyMetadata]: [ColonyRole.Root],
  [ColonyAndExtensionsEvents.DomainMetadata]: [ColonyRole.Architecture],
  [ColonyAndExtensionsEvents.ColonyRoleSet]: [ColonyRole.Architecture],
  [ColonyAndExtensionsEvents.RecoveryModeEntered]: [ColonyRole.Recovery],
  [ColonyAndExtensionsEvents.RecoveryStorageSlotSet]: [ColonyRole.Recovery],
  [ColonyAndExtensionsEvents.RecoveryModeExitApproved]: [ColonyRole.Recovery],
  [ColonyAndExtensionsEvents.RecoveryModeExited]: [ColonyRole.Recovery],
  [ColonyAndExtensionsEvents.ArbitraryReputationUpdate]: [
    ColonyRole.Root,
    ColonyRole.Arbitration,
  ],
  [ColonyAndExtensionsEvents.Generic]: [],
};

/*
 * Which events to display on which action's page
 */

const MOTION_EVENTS = [
  ColonyAndExtensionsEvents.MotionCreated,
  ColonyAndExtensionsEvents.MotionStaked,
  ColonyAndExtensionsEvents.ObjectionRaised,
  ColonyAndExtensionsEvents.MotionFinalized,
  ColonyAndExtensionsEvents.MotionRewardClaimed,
];

export const ACTIONS_EVENTS: ActionsEventsMap = {
  [ColonyActionType.Payment]: [ColonyAndExtensionsEvents.OneTxPaymentMade],
  [ColonyActionType.MoveFunds]: [
    ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots,
  ],
  [ColonyActionType.UnlockToken]: [ColonyAndExtensionsEvents.TokenUnlocked],
  [ColonyActionType.MintTokens]: [ColonyAndExtensionsEvents.TokensMinted],
  [ColonyActionType.CreateDomain]: [ColonyAndExtensionsEvents.DomainAdded],
  [ColonyActionType.VersionUpgrade]: [ColonyAndExtensionsEvents.ColonyUpgraded],
  [ColonyActionType.ColonyEdit]: [ColonyAndExtensionsEvents.ColonyMetadata],
  [ColonyActionType.EditDomain]: [ColonyAndExtensionsEvents.DomainMetadata],
  [ColonyActionType.SetUserRoles]: [ColonyAndExtensionsEvents.ColonyRoleSet],
  [ColonyActionType.Recovery]: [
    ColonyAndExtensionsEvents.RecoveryModeEntered,
    ColonyAndExtensionsEvents.RecoveryStorageSlotSet,
    ColonyAndExtensionsEvents.RecoveryModeExitApproved,
    ColonyAndExtensionsEvents.RecoveryModeExited,
  ],
  [ColonyActionType.EmitDomainReputationPenalty]: [
    ColonyAndExtensionsEvents.ArbitraryReputationUpdate,
  ],
  [ColonyActionType.EmitDomainReputationReward]: [
    ColonyAndExtensionsEvents.ArbitraryReputationUpdate,
  ],
  [ColonyMotions.UnlockTokenMotion]: MOTION_EVENTS,
  [ColonyMotions.MintTokensMotion]: MOTION_EVENTS,
  [ColonyMotions.CreateDomainMotion]: MOTION_EVENTS,
  [ColonyMotions.EditDomainMotion]: MOTION_EVENTS,
  [ColonyMotions.ColonyEditMotion]: MOTION_EVENTS,
  [ColonyMotions.SetUserRolesMotion]: MOTION_EVENTS,
  [ColonyMotions.PaymentMotion]: MOTION_EVENTS,
  [ColonyMotions.MoveFundsMotion]: MOTION_EVENTS,
  [ColonyMotions.EmitDomainReputationPenaltyMotion]: MOTION_EVENTS,
  [ColonyMotions.EmitDomainReputationRewardMotion]: MOTION_EVENTS,
  [ColonyMotions.CreateDecisionMotion]: MOTION_EVENTS,
};
