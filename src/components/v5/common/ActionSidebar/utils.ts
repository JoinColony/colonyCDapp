import { apolloClient } from '~apollo';
import { Action } from '~constants/actions.ts';
import { SearchActionsDocument } from '~gql';
import { type ColonyContributorFragment } from '~gql';
import { ExtendedColonyActionType } from '~types/actions.ts';
import { type ColonyAction, ColonyActionType } from '~types/graphql.ts';
import { isQueryActive } from '~utils/isQueryActive.ts';
import {
  clearContributorsAndRolesCache,
  updateContributorVerifiedStatus,
} from '~utils/members.ts';
import { removeCacheEntry, CacheQueryKeys } from '~utils/queries.ts';
import { splitAddress } from '~utils/strings.ts';
import { type SearchSelectOption } from '~v5/shared/SearchSelect/types.ts';

import { type GroupListItem } from './partials/GroupedAction/types.ts';
import {
  GROUP_FUNDS_LIST,
  GROUP_TEAMS_LIST,
  GROUP_ADMIN_LIST,
} from './partials/ManageColonyGroup/GroupList.ts';
import { GROUP_LIST } from './partials/PaymentGroup/GroupList.ts';
import { type UserSearchSelectOption } from './partials/UserSelect/types.ts';

export const translateAction = (action?: Action) => {
  const actionName = action
    ?.split('-')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');

  return `actions.${actionName}`;
};

export const handleMotionCompleted = (action: ColonyAction) => {
  switch (action.type) {
    case ColonyActionType.MintTokensMotion:
    case ColonyActionType.MintTokensMultisig:
    case ColonyActionType.PaymentMotion:
    case ColonyActionType.PaymentMultisig:
    case ColonyActionType.MoveFundsMotion:
    case ColonyActionType.MoveFundsMultisig: {
      /**
       * This is not done in another place only because data might not yet be available in DB
       * We need to remove all getDomainBalance queries once a payment or funding has been successfully completed
       * By default it will refetch all active queries
       */
      removeCacheEntry(CacheQueryKeys.GetDomainBalance);
      break;
    }
    case ColonyActionType.AddVerifiedMembersMotion:
    case ColonyActionType.AddVerifiedMembersMultisig: {
      if (action.members) {
        updateContributorVerifiedStatus(
          action.members,
          action.colonyAddress,
          true,
        );
      }
      break;
    }
    case ColonyActionType.RemoveVerifiedMembersMotion:
    case ColonyActionType.RemoveVerifiedMembersMultisig: {
      if (action.members) {
        updateContributorVerifiedStatus(
          action.members,
          action.colonyAddress,
          false,
        );
      }
      break;
    }
    case ColonyActionType.CreateDecisionMotion: {
      if (isQueryActive('SearchActions')) {
        apolloClient.refetchQueries({ include: [SearchActionsDocument] });
      }
      break;
    }
    case ColonyActionType.SetUserRolesMotion:
    case ColonyActionType.SetUserRolesMultisig: {
      clearContributorsAndRolesCache();
      break;
    }
    default: {
      break;
    }
  }
};

export const mapActionTypeToAction = (
  action: ColonyAction | undefined | null,
) => {
  if (!action) {
    return null;
  }

  switch (action.type as ColonyActionType | ExtendedColonyActionType) {
    case ColonyActionType.MintTokens:
    case ColonyActionType.MintTokensMotion:
    case ColonyActionType.MintTokensMultisig:
      return Action.MintTokens;
    case ColonyActionType.Payment:
    case ColonyActionType.PaymentMotion:
    case ColonyActionType.PaymentMultisig:
    case ColonyActionType.MultiplePayment:
    case ColonyActionType.MultiplePaymentMotion:
    case ColonyActionType.MultiplePaymentMultisig:
      return Action.SimplePayment;
    case ColonyActionType.AddVerifiedMembers:
    case ColonyActionType.AddVerifiedMembersMotion:
    case ColonyActionType.AddVerifiedMembersMultisig:
    case ColonyActionType.RemoveVerifiedMembers:
    case ColonyActionType.RemoveVerifiedMembersMotion:
    case ColonyActionType.RemoveVerifiedMembersMultisig:
      return Action.ManageVerifiedMembers;
    case ColonyActionType.ColonyEdit:
    case ColonyActionType.ColonyEditMotion:
    case ColonyActionType.ColonyEditMultisig:
      return Action.EditColonyDetails;
    case ColonyActionType.CreateDomain:
    case ColonyActionType.CreateDomainMotion:
    case ColonyActionType.CreateDomainMultisig:
    case ExtendedColonyActionType.UpdateColonyObjectiveMotion:
    case ExtendedColonyActionType.UpdateColonyObjectiveMultisig:
      return Action.CreateNewTeam;
    case ColonyActionType.EditDomain:
    case ColonyActionType.EditDomainMotion:
    case ColonyActionType.EditDomainMultisig:
      return Action.EditExistingTeam;
    case ColonyActionType.ManageTokens:
    case ColonyActionType.ManageTokensMotion:
    case ColonyActionType.ManageTokensMultisig:
      return Action.ManageTokens;
    case ColonyActionType.MoveFunds:
    case ColonyActionType.MoveFundsMotion:
    case ColonyActionType.MoveFundsMultisig:
      return Action.TransferFunds;
    case ColonyActionType.SetUserRoles:
    case ColonyActionType.SetUserRolesMotion:
    case ColonyActionType.SetUserRolesMultisig:
      return Action.ManagePermissions;
    case ColonyActionType.VersionUpgrade:
    case ColonyActionType.VersionUpgradeMotion:
    case ColonyActionType.VersionUpgradeMultisig:
      return Action.UpgradeColonyVersion;
    case ColonyActionType.UnlockToken:
    case ColonyActionType.UnlockTokenMotion:
    case ColonyActionType.UnlockTokenMultisig:
      return Action.UnlockToken;
    case ColonyActionType.EmitDomainReputationPenalty:
    case ColonyActionType.EmitDomainReputationPenaltyMotion:
    case ColonyActionType.EmitDomainReputationPenaltyMultisig:
    case ColonyActionType.EmitDomainReputationReward:
    case ColonyActionType.EmitDomainReputationRewardMotion:
    case ColonyActionType.EmitDomainReputationRewardMultisig:
      return Action.ManageReputation;
    case ColonyActionType.MakeArbitraryTransaction:
    case ColonyActionType.MakeArbitraryTransactionsMotion:
    case ColonyActionType.MakeArbitraryTransactionsMultisig:
      return Action.ArbitraryTxs;
    case ColonyActionType.Recovery:
      return Action.EnterRecoveryMode;
    case ExtendedColonyActionType.StagedPayment:
      return Action.StagedPayment;
    case ExtendedColonyActionType.SplitPayment:
      return Action.SplitPayment;
    default:
      return null;
  }
};

const getAvailableActions = (list: GroupListItem[]) =>
  list.filter((item) => !item.isHidden).map((item) => item.action);

const ManageColonyActions = getAvailableActions([
  ...GROUP_ADMIN_LIST,
  ...GROUP_FUNDS_LIST,
  ...GROUP_TEAMS_LIST,
]);
const PaymentActions = getAvailableActions(GROUP_LIST);

export const getActionGroup = (actionType: Action) => {
  if (!actionType) {
    return null;
  }

  if (ManageColonyActions.includes(actionType)) return Action.ManageColony;

  if (PaymentActions.includes(actionType)) {
    return Action.PaymentGroup;
  }

  return null;
};

export const formatMembersSelectOptions = (
  members: ColonyContributorFragment[],
  isVerified = true,
): SearchSelectOption<UserSearchSelectOption>[] => {
  return members.map((member, index) => {
    const { walletAddress, profile } = member.user || {};

    const splittedWalletAddress = walletAddress && splitAddress(walletAddress);
    const maskedWalletAddress =
      splittedWalletAddress &&
      `${splittedWalletAddress.header}${splittedWalletAddress.start}...${splittedWalletAddress.end}`;

    const splittedContributorAddress = splitAddress(member.contributorAddress);
    const maskedContributorAddress = `${splittedContributorAddress.header}${splittedContributorAddress.start}...${splittedContributorAddress.end}`;

    const walletAddressValue = walletAddress || member.contributorAddress || '';

    return {
      value: walletAddressValue,
      isVerified,
      label:
        profile?.displayName ||
        (walletAddress && maskedWalletAddress) ||
        maskedContributorAddress,
      avatar: profile?.thumbnail || profile?.avatar || undefined,
      id: index,
      profile,
      showAvatar: true,
      walletAddress: walletAddressValue,
    };
  });
};
