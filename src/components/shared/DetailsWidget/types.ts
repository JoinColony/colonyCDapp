import {
  AnyActionType,
  ColonyActionType,
  ExtendedColonyActionType,
} from '~types';

/*
 * Which icons correspond to which action types in the details widget
 */
export const ACTION_TYPES_ICONS_MAP: Record<AnyActionType, string> = {
  [ColonyActionType.WrongColony]: 'forbidden-signal',
  [ColonyActionType.Payment]: 'emoji-dollar-stack',
  [ColonyActionType.Recovery]: 'emoji-alarm-lamp',
  [ColonyActionType.MoveFunds]: 'emoji-world-globe',
  [ColonyActionType.UnlockToken]: 'emoji-padlock',
  [ColonyActionType.MintTokens]: 'emoji-seed-sprout',
  [ColonyActionType.CreateDomain]: 'emoji-crane',
  [ColonyActionType.VersionUpgrade]: 'emoji-strong-person',
  [ColonyActionType.ColonyEdit]: 'emoji-edit-tools',
  [ColonyActionType.EditDomain]: 'emoji-pencil-note',
  [ColonyActionType.SetUserRoles]: 'emoji-crane',
  [ColonyActionType.EmitDomainReputationPenalty]: 'emoji-firebolt',
  [ColonyActionType.EmitDomainReputationReward]: 'emoji-shooting-star',
  [ColonyActionType.MintTokensMotion]: 'emoji-seed-sprout',
  [ColonyActionType.PaymentMotion]: 'emoji-dollar-stack',
  [ColonyActionType.MoveFundsMotion]: 'emoji-world-globe',
  [ColonyActionType.CreateDomainMotion]: 'emoji-crane',
  [ColonyActionType.VersionUpgradeMotion]: 'emoji-strong-person',
  [ColonyActionType.ColonyEditMotion]: 'emoji-edit-tools',
  [ColonyActionType.EditDomainMotion]: 'emoji-pencil-note',
  [ColonyActionType.SetUserRolesMotion]: 'emoji-crane',
  [ColonyActionType.EmitDomainReputationPenaltyMotion]: 'emoji-firebolt',
  [ColonyActionType.EmitDomainReputationRewardMotion]: 'emoji-shooting-star',
  [ColonyActionType.UnlockTokenMotion]: 'emoji-padlock',
  // [ColonyMotions.CreateDecisionMotion]: 'emoji-decisions',
  [ColonyActionType.NullMotion]: 'forbidden-signal',
  [ColonyActionType.Generic]: 'circle-check-primary',
  [ExtendedColonyActionType.UpdateAddressBook]: 'emoji-edit-tools',
  [ExtendedColonyActionType.UpdateTokens]: 'emoji-edit-tools',
};
