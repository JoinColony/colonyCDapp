import { ColonyActions, ColonyMotions } from '~types';

/*
 * Which icons correspond to which action types in the details widget
 */
export const ACTION_TYPES_ICONS_MAP: {
  [key in ColonyActions | ColonyMotions]: string;
} = {
  [ColonyActions.WrongColony]: 'forbidden-signal',
  [ColonyActions.Payment]: 'emoji-dollar-stack',
  [ColonyActions.Recovery]: 'emoji-alarm-lamp',
  [ColonyActions.MoveFunds]: 'emoji-world-globe',
  [ColonyActions.UnlockToken]: 'emoji-padlock',
  [ColonyActions.MintTokens]: 'emoji-seed-sprout',
  [ColonyActions.CreateDomain]: 'emoji-crane',
  [ColonyActions.VersionUpgrade]: 'emoji-strong-person',
  [ColonyActions.ColonyEdit]: 'emoji-edit-tools',
  [ColonyActions.EditDomain]: 'emoji-pencil-note',
  [ColonyActions.SetUserRoles]: 'emoji-crane',
  [ColonyActions.EmitDomainReputationPenalty]: 'emoji-firebolt',
  [ColonyActions.EmitDomainReputationReward]: 'emoji-shooting-star',
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
  [ColonyMotions.CreateDecisionMotion]: 'emoji-decisions',
  [ColonyMotions.NullMotion]: 'forbidden-signal',
  [ColonyActions.Generic]: 'circle-check-primary',
};
