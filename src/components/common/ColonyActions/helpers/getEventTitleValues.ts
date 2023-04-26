import {
  AnyMessageValues,
  Colony,
  ColonyAction,
  ColonyAndExtensionsEvents,
  MotionMessage,
  SystemMessages,
  MotionData,
  ColonyActionType,
} from '~types';

import {
  mapActionEventToExpectedFormat,
  useMapMotionEventToExpectedFormat,
} from './mapItemToMessageFormat';

enum EventTitleMessageKeys {
  Amount = 'amount',
  AmountTag = 'amountTag',
  BackedSideTag = 'backedSideTag',
  Changed = 'changed',
  ClientOrExtensionType = 'clientOrExtensionType',
  ColonyMetadata = 'colonyMetadata',
  ColonyMetadataChanges = 'colonyMetadataChanges',
  DomainMetadataChanges = 'domainMetadataChanges',
  EventNameDecorated = 'eventNameDecorated',
  FromDomain = 'fromDomain',
  Initiator = 'initiator',
  IsSmiteAction = 'isSmiteAction',
  MotionTag = 'motionTag',
  NewVersion = 'newVersion',
  ObjectionTag = 'objectionTag',
  Recipient = 'recipient',
  ReputationChangeNumeral = 'reputationChangeNumeral',
  ReputationChange = 'reputationChange',
  Role = 'role',
  RoleSetAction = 'roleSetAction',
  RoleSetDirection = 'roleSetDirection',
  Staker = 'staker',
  StorageSlot = 'storageSlot',
  TokenSymbol = 'tokenSymbol',
  ToDomain = 'toDomain',
  TokensMinted = 'tokensMinted',
  VotingTag = 'votingTag',
  VoteResultsWidget = 'VoteResultsWidget',
  FailedTag = 'FailedTag',
}

/* Maps eventType to message values as found in en-events.ts */
const EVENT_TYPE_MESSAGE_KEYS_MAP: {
  [key in ColonyAndExtensionsEvents | SystemMessages]?: EventTitleMessageKeys[];
} = {
  [ColonyAndExtensionsEvents.OneTxPaymentMade]: [
    EventTitleMessageKeys.Amount,
    EventTitleMessageKeys.FromDomain,
    EventTitleMessageKeys.Initiator,
    EventTitleMessageKeys.Recipient,
    EventTitleMessageKeys.TokenSymbol,
  ],
  [ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots]: [
    EventTitleMessageKeys.Amount,
    EventTitleMessageKeys.FromDomain,
    EventTitleMessageKeys.Initiator,
    EventTitleMessageKeys.Recipient,
    EventTitleMessageKeys.ToDomain,
    EventTitleMessageKeys.TokenSymbol,
  ],
  [ColonyAndExtensionsEvents.TokenUnlocked]: [
    EventTitleMessageKeys.TokenSymbol,
  ],
  [ColonyAndExtensionsEvents.TokensMinted]: [
    EventTitleMessageKeys.Amount,
    EventTitleMessageKeys.Initiator,
    EventTitleMessageKeys.Recipient,
    EventTitleMessageKeys.TokenSymbol,
  ],
  [ColonyAndExtensionsEvents.DomainAdded]: [
    EventTitleMessageKeys.FromDomain,
    EventTitleMessageKeys.Initiator,
  ],
  [ColonyAndExtensionsEvents.ColonyUpgraded]: [
    EventTitleMessageKeys.NewVersion,
  ],
  // [ColonyAndExtensionsEvents.RecoveryModeEntered]: [
  //   EventTitleMessageKeys.Initiator,
  // ],
  // [ColonyAndExtensionsEvents.RecoveryStorageSlotSet]: [
  //   EventTitleMessageKeys.Initiator,
  //   EventTitleMessageKeys.StorageSlot,
  // ],
  // [ColonyAndExtensionsEvents.RecoveryModeExitApproved]: [
  //   EventTitleMessageKeys.Initiator,
  // ],
  // [ColonyAndExtensionsEvents.RecoveryModeExited]: [
  //   EventTitleMessageKeys.Initiator,
  // ],
  [ColonyAndExtensionsEvents.MotionCreated]: [
    EventTitleMessageKeys.Initiator,
    EventTitleMessageKeys.MotionTag,
  ],
  [ColonyAndExtensionsEvents.MotionStaked]: [
    EventTitleMessageKeys.Staker,
    EventTitleMessageKeys.BackedSideTag,
    EventTitleMessageKeys.AmountTag,
  ],
  [ColonyAndExtensionsEvents.MotionFinalized]: [
    EventTitleMessageKeys.MotionTag,
  ],
  [ColonyAndExtensionsEvents.ObjectionRaised]: [
    EventTitleMessageKeys.Staker,
    EventTitleMessageKeys.ObjectionTag,
  ],
  [ColonyAndExtensionsEvents.MotionRewardClaimed]: [
    EventTitleMessageKeys.Staker,
  ],
  [ColonyAndExtensionsEvents.ColonyMetadata]: [
    EventTitleMessageKeys.Initiator,
    EventTitleMessageKeys.Changed,
    EventTitleMessageKeys.ColonyMetadataChanges,
  ],
  [ColonyAndExtensionsEvents.DomainMetadata]: [
    EventTitleMessageKeys.Initiator,
    EventTitleMessageKeys.DomainMetadataChanges,
  ],
  [ColonyAndExtensionsEvents.ColonyRoleSet]: [
    EventTitleMessageKeys.Initiator,
    EventTitleMessageKeys.RoleSetAction,
    EventTitleMessageKeys.Role,
    EventTitleMessageKeys.FromDomain,
    EventTitleMessageKeys.RoleSetDirection,
    EventTitleMessageKeys.Recipient,
  ],
  [ColonyAndExtensionsEvents.ArbitraryReputationUpdate]: [
    EventTitleMessageKeys.Initiator,
    EventTitleMessageKeys.IsSmiteAction,
    EventTitleMessageKeys.ReputationChange,
    EventTitleMessageKeys.ReputationChangeNumeral,
    EventTitleMessageKeys.Recipient,
  ],
  [SystemMessages.ObjectionFullyStaked]: [
    EventTitleMessageKeys.ObjectionTag,
    EventTitleMessageKeys.MotionTag,
  ],
  [SystemMessages.MotionFullyStakedAfterObjection]: [
    EventTitleMessageKeys.MotionTag,
  ],
  [SystemMessages.MotionFullyStaked]: [
    EventTitleMessageKeys.ObjectionTag,
    EventTitleMessageKeys.MotionTag,
  ],
  [SystemMessages.MotionVotingPhase]: [EventTitleMessageKeys.VotingTag],
  [SystemMessages.MotionRevealResultObjectionWon]: [
    EventTitleMessageKeys.MotionTag,
    EventTitleMessageKeys.VoteResultsWidget,
  ],
  [SystemMessages.MotionRevealResultMotionWon]: [
    EventTitleMessageKeys.MotionTag,
    EventTitleMessageKeys.VoteResultsWidget,
  ],
  [SystemMessages.MotionHasFailedFinalizable]: [
    EventTitleMessageKeys.MotionTag,
    EventTitleMessageKeys.FailedTag,
  ],
};

const DEFAULT_KEYS = [
  EventTitleMessageKeys.EventNameDecorated,
  EventTitleMessageKeys.ClientOrExtensionType,
];

/* Filters the item by keys provided */
export const generateMessageValues = (
  item: Record<string, any>,
  keys: string[],
  initialEntry: Record<string, any>,
) =>
  keys.reduce<AnyMessageValues>(
    (values, key) => ({
      ...values,
      [key]: item[key],
    }),
    initialEntry,
  );

/* Returns the correct message values for Actions according to the event type. */
export const getActionEventTitleValues = (
  eventName: ColonyAndExtensionsEvents,
  actionData: ColonyAction,
  colony?: Colony,
) => {
  const updatedItem = mapActionEventToExpectedFormat(
    eventName,
    actionData,
    colony,
  );
  const keys = EVENT_TYPE_MESSAGE_KEYS_MAP[eventName] ?? DEFAULT_KEYS;
  return generateMessageValues(updatedItem, keys, {
    eventName,
  });
};

/* Returns the correct message values for Motions according to the event type. */
export const useGetMotionEventTitleValues = (
  eventName: ColonyAndExtensionsEvents | SystemMessages,
  motionMessageData: MotionMessage,
  actionType: ColonyActionType,
  motionData?: MotionData | null,
) => {
  const updatedItem = useMapMotionEventToExpectedFormat(
    motionMessageData,
    actionType,
    motionData,
  );
  const keys = EVENT_TYPE_MESSAGE_KEYS_MAP[eventName] ?? DEFAULT_KEYS;
  return generateMessageValues(updatedItem, keys, {
    eventName,
  });
};
