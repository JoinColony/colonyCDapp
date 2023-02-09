import {
  AnyActionType,
  ColonyActionType,
  ColonyMotions,
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
  [ColonyMotions.MintTokensMotion]: 'emoji-seed-sprout',
  [ColonyMotions.PaymentMotion]: 'emoji-dollar-stack',
  [ColonyMotions.MoveFundsMotion]: 'emoji-world-globe',
  [ColonyMotions.CreateDomainMotion]: 'emoji-crane',
  [ColonyMotions.VersionUpgradeMotion]: 'emoji-strong-person',
  [ColonyMotions.ColonyEditMotion]: 'emoji-edit-tools',
  [ColonyMotions.EditDomainMotion]: 'emoji-pencil-note',
  [ColonyMotions.SetUserRolesMotion]: 'emoji-crane',
  [ColonyMotions.EmitDomainReputationPenaltyMotion]: 'emoji-firebolt',
  [ColonyMotions.EmitDomainReputationRewardMotion]: 'emoji-shooting-star',
  [ColonyMotions.UnlockTokenMotion]: 'emoji-padlock',
  // [ColonyMotions.CreateDecisionMotion]: 'emoji-decisions',
  // [ColonyMotions.NullMotion]: 'forbidden-signal',
  [ColonyActionType.Generic]: 'circle-check-primary',
  [ExtendedColonyActionType.UpdateAddressBook]: 'emoji-edit-tools',
  [ExtendedColonyActionType.UpdateTokens]: 'emoji-edit-tools',
};
