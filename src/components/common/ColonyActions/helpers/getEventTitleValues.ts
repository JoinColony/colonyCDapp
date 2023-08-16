import { SafeTransactionType } from '~gql';
import {
  AnyMessageValues,
  Colony,
  ColonyAction,
  ColonyAndExtensionsEvents,
  ExtendedColonyActionType,
  MotionMessage,
  SystemMessages,
} from '~types';
import { getExtendedActionType } from '~utils/colonyActions';
import { getSafeInteractionType } from '~utils/safes';

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
  VoteResultsWidget = 'voteResultsWidget',
  FailedTag = 'failedTag',
  RevealTag = 'revealTag',
  PassedTag = 'passedTag',
  ChainName = 'chainName',
  SafeAddress = 'safeAddress',
  RemovedSafes = 'removedSafes',
  SafeName = 'safeName',
  SafeTransactionAmount = 'safeTransactionAmount',
  IsSafeTransactionRecipientUser = 'isSafeTransactionRecipientUser',
  SafeTransactionRecipient = 'safeTransactionRecipient',
  SafeTransactionAddress = 'safeTransactionAddress',
  SafeTransactionContractName = 'safeTransactionContractName',
  SafeTransactionFunctionName = 'safeTransactionFunctionName',
  SafeTransactionNftToken = 'safeTransactionNftToken',
}

/* Maps eventType to message values as found in en-events.ts */
const EVENT_TYPE_MESSAGE_KEYS_MAP: {
  [key in
    | ColonyAndExtensionsEvents
    | SystemMessages
    | SafeTransactionType]?: EventTitleMessageKeys[];
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
  [SystemMessages.MotionRevealPhase]: [EventTitleMessageKeys.RevealTag],
  [SystemMessages.MotionHasPassed]: [
    EventTitleMessageKeys.MotionTag,
    EventTitleMessageKeys.PassedTag,
  ],
  [SystemMessages.MotionHasFailedNotFinalizable]: [
    EventTitleMessageKeys.MotionTag,
  ],
  [ColonyAndExtensionsEvents.SafeAdded]: [
    EventTitleMessageKeys.Initiator,
    EventTitleMessageKeys.SafeAddress,
    EventTitleMessageKeys.ChainName,
  ],
  [ColonyAndExtensionsEvents.SafeRemoved]: [
    EventTitleMessageKeys.Initiator,
    EventTitleMessageKeys.RemovedSafes,
  ],
  [SafeTransactionType.TransferFunds]: [
    EventTitleMessageKeys.SafeName,
    EventTitleMessageKeys.SafeTransactionAmount,
    EventTitleMessageKeys.IsSafeTransactionRecipientUser,
    EventTitleMessageKeys.SafeTransactionRecipient,
    EventTitleMessageKeys.SafeTransactionAddress,
  ],
  [SafeTransactionType.RawTransaction]: [
    EventTitleMessageKeys.SafeName,
    EventTitleMessageKeys.IsSafeTransactionRecipientUser,
    EventTitleMessageKeys.SafeTransactionRecipient,
    EventTitleMessageKeys.SafeTransactionAddress,
  ],
  [SafeTransactionType.TransferNft]: [
    EventTitleMessageKeys.SafeName,
    EventTitleMessageKeys.SafeTransactionNftToken,
    EventTitleMessageKeys.IsSafeTransactionRecipientUser,
    EventTitleMessageKeys.SafeTransactionRecipient,
    EventTitleMessageKeys.SafeTransactionAddress,
  ],
  [SafeTransactionType.ContractInteraction]: [
    EventTitleMessageKeys.SafeName,
    EventTitleMessageKeys.SafeTransactionFunctionName,
    EventTitleMessageKeys.SafeTransactionContractName,
  ],
  [SafeTransactionType.MultipleTransactions]: [EventTitleMessageKeys.SafeName],
};

const DEFAULT_KEYS = [
  EventTitleMessageKeys.EventNameDecorated,
  EventTitleMessageKeys.ClientOrExtensionType,
];

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

const getExtendedEventName = (
  eventName: ColonyAndExtensionsEvents,
  actionData: ColonyAction,
) => {
  const { isMotion, pendingColonyMetadata, colony } = actionData;
  const actionType = getExtendedActionType(
    actionData,
    isMotion ? pendingColonyMetadata : colony.metadata,
  );

  if (actionType === ExtendedColonyActionType.AddSafe) {
    return ColonyAndExtensionsEvents.SafeAdded;
  }

  if (actionType === ExtendedColonyActionType.RemoveSafe) {
    return ColonyAndExtensionsEvents.SafeRemoved;
  }

  const safeInteractionEventName = getSafeInteractionType(actionData);

  return safeInteractionEventName || eventName;
};

/* Returns the correct message values for Actions according to the event type. */
export const getActionEventTitleValues = (
  eventName: ColonyAndExtensionsEvents,
  actionData: ColonyAction,
  eventId?: string,
  colony?: Colony,
) => {
  const updatedItem = mapActionEventToExpectedFormat(
    eventName,
    actionData,
    eventId,
    colony,
  );
  const extendedEventName = getExtendedEventName(eventName, actionData);
  const keys = EVENT_TYPE_MESSAGE_KEYS_MAP[extendedEventName] ?? DEFAULT_KEYS;
  return generateMessageValues(updatedItem, keys, {
    eventName: extendedEventName,
  });
};

/* Returns the correct message values for Motions according to the event type. */
export const useGetMotionEventTitleValues = (
  eventName: ColonyAndExtensionsEvents | SystemMessages,
  motionMessageData: MotionMessage,
  actionData: ColonyAction,
) => {
  const updatedItem = useMapMotionEventToExpectedFormat(
    motionMessageData,
    actionData,
  );
  const keys = EVENT_TYPE_MESSAGE_KEYS_MAP[eventName] ?? DEFAULT_KEYS;
  return generateMessageValues(updatedItem, keys, {
    eventName,
  });
};
