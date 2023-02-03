import { ColonyRole } from '@colony/colony-js';

import {
  ColonyActions,
  ColonyAndExtensionsEvents,
  ColonyMotions,
} from '~types';

export enum Status {
  Failed = 'failed',
  Pending = 'pending',
  Succeeded = 'succeeded',
  SystemMessage = 'systemMessage',
}

/*
 * Transaction statuses
 */
export const STATUS_MAP: { [k: number]: Status } = {
  0: Status.Failed,
  1: Status.Succeeded,
  2: Status.Pending,
};

type EventRolesMap = Partial<{
  [key in ColonyAndExtensionsEvents]: ColonyRole[];
}>;

type ActionsEventsMap = Partial<{
  [key in ColonyActions | ColonyMotions]: ColonyAndExtensionsEvents[];
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
  [ColonyActions.Payment]: [ColonyAndExtensionsEvents.OneTxPaymentMade],
  [ColonyActions.MoveFunds]: [
    ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots,
  ],
  [ColonyActions.UnlockToken]: [ColonyAndExtensionsEvents.TokenUnlocked],
  [ColonyActions.MintTokens]: [ColonyAndExtensionsEvents.TokensMinted],
  [ColonyActions.CreateDomain]: [ColonyAndExtensionsEvents.DomainAdded],
  [ColonyActions.VersionUpgrade]: [ColonyAndExtensionsEvents.ColonyUpgraded],
  [ColonyActions.ColonyEdit]: [ColonyAndExtensionsEvents.ColonyMetadata],
  [ColonyActions.EditDomain]: [ColonyAndExtensionsEvents.DomainMetadata],
  [ColonyActions.SetUserRoles]: [ColonyAndExtensionsEvents.ColonyRoleSet],
  [ColonyActions.Recovery]: [
    ColonyAndExtensionsEvents.RecoveryModeEntered,
    ColonyAndExtensionsEvents.RecoveryStorageSlotSet,
    ColonyAndExtensionsEvents.RecoveryModeExitApproved,
    ColonyAndExtensionsEvents.RecoveryModeExited,
  ],
  [ColonyActions.EmitDomainReputationPenalty]: [
    ColonyAndExtensionsEvents.ArbitraryReputationUpdate,
  ],
  [ColonyActions.EmitDomainReputationReward]: [
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
