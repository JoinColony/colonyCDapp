import {
  AnyMessageValues,
  Colony,
  ColonyAndExtensionsEvents,
  FormattedAction,
} from '~types';
import { MockEvent } from '../mockData';
import { mapColonyEventToExpectedFormat } from './mapItemToMessageFormat';

enum EventTitleMessageKeys {
  Amount = 'amount',
  AmountTag = 'amountTag',
  BackedSideTag = 'backedSideTag',
  Changed = 'changed',
  ClientOrExtensionType = 'clientOrExtensionType',
  ColonyMetadata = 'colonyMetadata',
  ColonyMetadataChange = 'colonyMetadataChange',
  DomainMetadataChanged = 'domainMetadataChanged',
  EventNameDecorated = 'eventNameDecorated',
  FromDomain = 'fromDomain',
  Initiator = 'initiator',
  IsSmiteAction = 'isSmiteAction',
  MotionTag = 'motionTag',
  NewDomainMetadata = 'newDomainMetadata',
  NewVersion = 'newVersion',
  ObjectionTag = 'objectionTag',
  OldDomainMetadata = 'oldDomainMetadata',
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
}

/* Maps eventType to message values as found in en-events.ts */
const getMessageDescriptorKeys = (eventType: ColonyAndExtensionsEvents) => {
  switch (eventType) {
    case ColonyAndExtensionsEvents.OneTxPaymentMade:
      return [
        EventTitleMessageKeys.Amount,
        EventTitleMessageKeys.FromDomain,
        EventTitleMessageKeys.Initiator,
        EventTitleMessageKeys.Recipient,
        EventTitleMessageKeys.TokenSymbol,
      ];
    case ColonyAndExtensionsEvents.ColonyFundsMovedBetweenFundingPots:
      return [
        EventTitleMessageKeys.Amount,
        EventTitleMessageKeys.FromDomain,
        EventTitleMessageKeys.Initiator,
        EventTitleMessageKeys.Recipient,
        EventTitleMessageKeys.ToDomain,
        EventTitleMessageKeys.TokenSymbol,
      ];
    case ColonyAndExtensionsEvents.TokenUnlocked:
      return [EventTitleMessageKeys.TokenSymbol];
    case ColonyAndExtensionsEvents.TokensMinted:
      return [
        EventTitleMessageKeys.Amount,
        EventTitleMessageKeys.Initiator,
        EventTitleMessageKeys.Recipient,
        EventTitleMessageKeys.TokenSymbol,
      ];
    case ColonyAndExtensionsEvents.DomainAdded:
      return [
        EventTitleMessageKeys.FromDomain,
        EventTitleMessageKeys.Initiator,
      ];
    case ColonyAndExtensionsEvents.ColonyUpgraded:
      return [EventTitleMessageKeys.NewVersion];
    case ColonyAndExtensionsEvents.MotionFinalized:
      return [EventTitleMessageKeys.MotionTag];
    case ColonyAndExtensionsEvents.MotionRewardClaimed:
      return [EventTitleMessageKeys.Staker];
    case ColonyAndExtensionsEvents.RecoveryModeEntered:
      return [EventTitleMessageKeys.Initiator];
    // case ColonyAndExtensionsEvents.RecoveryStorageSlotSet:
    //   return [
    //     EventTitleMessageKeys.Initiator,
    //     EventTitleMessageKeys.StorageSlot,
    //   ];
    // case ColonyAndExtensionsEvents.RecoveryModeExitApproved:
    //   return [EventTitleMessageKeys.Initiator];
    // case ColonyAndExtensionsEvents.RecoveryModeExited:
    //   return [EventTitleMessageKeys.Initiator];
    // case ColonyAndExtensionsEvents.MotionCreated:
    //   return [EventTitleMessageKeys.Initiator, EventTitleMessageKeys.MotionTag];
    // case ColonyAndExtensionsEvents.MotionStaked:
    //   return [
    //     EventTitleMessageKeys.Staker,
    //     EventTitleMessageKeys.BackedSideTag,
    //     EventTitleMessageKeys.AmountTag,
    //   ];
    // case ColonyAndExtensionsEvents.MotionFinalized:
    //   return [EventTitleMessageKeys.MotionTag];
    // case ColonyAndExtensionsEvents.ObjectionRaised:
    //   return [EventTitleMessageKeys.Staker, EventTitleMessageKeys.ObjectionTag];
    // case ColonyAndExtensionsEvents.MotionRewardClaimed:
    //   return [EventTitleMessageKeys.Staker];
    case ColonyAndExtensionsEvents.ColonyMetadata:
      return [
        EventTitleMessageKeys.Initiator,
        EventTitleMessageKeys.Changed,
        EventTitleMessageKeys.ColonyMetadata,
        EventTitleMessageKeys.ColonyMetadataChange,
      ];
    case ColonyAndExtensionsEvents.DomainMetadata:
      return [
        EventTitleMessageKeys.Initiator,
        EventTitleMessageKeys.DomainMetadataChanged,
        EventTitleMessageKeys.OldDomainMetadata,
        EventTitleMessageKeys.NewDomainMetadata,
      ];
    case ColonyAndExtensionsEvents.ColonyRoleSet:
      return [
        EventTitleMessageKeys.Initiator,
        EventTitleMessageKeys.RoleSetAction,
        EventTitleMessageKeys.Role,
        EventTitleMessageKeys.FromDomain,
        EventTitleMessageKeys.RoleSetDirection,
        EventTitleMessageKeys.Recipient,
      ];
    case ColonyAndExtensionsEvents.ArbitraryReputationUpdate:
      return [
        EventTitleMessageKeys.Initiator,
        EventTitleMessageKeys.IsSmiteAction,
        EventTitleMessageKeys.ReputationChange,
        EventTitleMessageKeys.ReputationChangeNumeral,
        EventTitleMessageKeys.Recipient,
      ];

    default:
      return [
        EventTitleMessageKeys.EventNameDecorated,
        EventTitleMessageKeys.ClientOrExtensionType,
      ];
  }
};

/* Returns the correct message values according to the event type. */
const getEventTitleValues = (
  eventData: MockEvent & { eventName: ColonyAndExtensionsEvents },
  actionItem: FormattedAction,
  colony?: Colony,
) => {
  const updatedItem = mapColonyEventToExpectedFormat(
    eventData,
    actionItem,
    colony,
  );
  const keys = getMessageDescriptorKeys(eventData.eventName);
  const titleValues = keys.reduce<AnyMessageValues>(
    (values, key) => ({
      ...values,
      [key]: updatedItem[key],
    }),
    { eventName: eventData.eventName },
  );
  return titleValues;
};

export default getEventTitleValues;
