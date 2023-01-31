/* eslint-disable max-len */

import { ColonyActions, ColonyMotions } from '~types';

const actionsMessageDescriptors = {
  'action.title': `{actionType, select,
      ${ColonyActions.WrongColony} {Unknown Action}
      ${ColonyActions.Payment} {Pay {recipient} {amount} {tokenSymbol}}
      ${ColonyMotions.PaymentMotion} {Pay {recipient} {amount} {tokenSymbol}}
      ${ColonyActions.MoveFunds} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain}}
      ${ColonyMotions.MoveFundsMotion} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain}}
      ${ColonyActions.UnlockToken} {Unlock native token {tokenSymbol}}
      ${ColonyMotions.UnlockTokenMotion} {Unlock native token {tokenSymbol}}
      ${ColonyActions.MintTokens} {Mint {amount} {tokenSymbol}}
      ${ColonyMotions.MintTokensMotion} {Mint {amount} {tokenSymbol}}
      ${ColonyActions.CreateDomain} {New team: {fromDomain}}
      ${ColonyMotions.CreateDomainMotion} {New team: {fromDomain}}
      ${ColonyActions.VersionUpgrade} {Upgrade Colony to Version {newVersion}!}
      ${ColonyMotions.VersionUpgradeMotion} {Upgrade Colony to Version {newVersion}!}
      ${ColonyActions.ColonyEdit} {Colony details changed}
      ${ColonyMotions.ColonyEditMotion} {Change colony details}
      ${ColonyActions.EditDomain} {{fromDomain} team details edited}
      ${ColonyMotions.EditDomainMotion} {Edit {fromDomain} team details}
      ${ColonyActions.Recovery} {Recovery mode activated by {initiator}}
      ${ColonyActions.EmitDomainReputationPenalty} {Smite {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation penalty}
      ${ColonyMotions.EmitDomainReputationPenaltyMotion} {Smite {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation penalty}
      ${ColonyActions.EmitDomainReputationReward} {Award {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation reward}
      ${ColonyMotions.EmitDomainReputationRewardMotion} {Award {recipient} with a {reputationChangeNumeral} {reputationChange, plural, one {pt} other {pts}} reputation reward}
      ${ColonyActions.SetUserRoles} {{rolesChanged} in {fromDomain} {direction} {recipient}}
      ${ColonyMotions.SetUserRolesMotion} {{rolesChanged} in {fromDomain} {direction} {recipient}}
      other {Generic action we don't have information about}
    }`,
  'action.type': `{actionType, select,
      ${ColonyActions.WrongColony} {Not part of the Colony}
      ${ColonyActions.Payment} {Payment}
      ${ColonyMotions.PaymentMotion} {Payment}
      ${ColonyActions.MoveFunds} {Move Funds}
      ${ColonyMotions.MoveFundsMotion} {Move Funds}
      ${ColonyActions.UnlockToken} {Unlock Token}
      ${ColonyMotions.UnlockTokenMotion} {Unlock Token}
      ${ColonyActions.MintTokens} {Mint Tokens}
      ${ColonyMotions.MintTokensMotion} {Mint Tokens}
      ${ColonyActions.CreateDomain} {Create Team}
      ${ColonyMotions.CreateDomainMotion} {Create Team}
      ${ColonyActions.VersionUpgrade} {Version Upgrade}
      ${ColonyMotions.VersionUpgradeMotion} {Version Upgrade}
      ${ColonyActions.ColonyEdit} {Colony Edit}
      ${ColonyMotions.ColonyEditMotion} {Colony Edit}
      ${ColonyActions.EditDomain} {Edit Team}
      ${ColonyMotions.EditDomainMotion} {Edit Team}
      ${ColonyActions.SetUserRoles} {Permission Management}
      ${ColonyMotions.SetUserRolesMotion} {Permission Management}
      ${ColonyActions.Recovery} {Recovery}
      ${ColonyActions.EmitDomainReputationPenalty} {Smite}
      ${ColonyMotions.EmitDomainReputationPenaltyMotion} {Smite}
      ${ColonyActions.EmitDomainReputationReward} {Award}
      ${ColonyMotions.EmitDomainReputationRewardMotion} {Award}
      other {Generic}
    }`,
};

export default actionsMessageDescriptors;
