import { ColonyRole } from '@colony/colony-js';

import { ColonyAndExtensionsEvents } from '~types';

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
