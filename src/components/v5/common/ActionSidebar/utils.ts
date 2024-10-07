import { BigNumber } from 'ethers';

import { CoreAction, type ActionData } from '~actions/index.ts';
import { apolloClient } from '~apollo';
import { SearchActionsDocument } from '~gql';
import { type Expenditure } from '~types/graphql.ts';
import { isQueryActive } from '~utils/isQueryActive.ts';
import {
  clearContributorsAndRolesCache,
  updateContributorVerifiedStatus,
} from '~utils/members.ts';

// FIXME: what does this do??
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

// FIXME: Split this up somehow!
export const handleMotionCompleted = (actionData: ActionData) => {
  switch (actionData.type) {
    case CoreAction.AddVerifiedMembersMotion:
    case CoreAction.AddVerifiedMembersMultisig: {
      if (actionData.members) {
        updateContributorVerifiedStatus(
          actionData.members,
          actionData.colonyAddress,
          true,
        );
      }
      break;
    }
    case CoreAction.RemoveVerifiedMembersMotion:
    case CoreAction.RemoveVerifiedMembersMultisig: {
      if (actionData.members) {
        updateContributorVerifiedStatus(
          actionData.members,
          actionData.colonyAddress,
          false,
        );
      }
      break;
    }
    case CoreAction.CreateDecisionMotion: {
      if (isQueryActive('SearchActions')) {
        apolloClient.refetchQueries({ include: [SearchActionsDocument] });
      }
      break;
    }
    case CoreAction.SetUserRolesMotion:
    case CoreAction.SetUserRolesMultisig: {
      clearContributorsAndRolesCache();
      break;
    }
    default: {
      break;
    }
  }
};

/**
 * Returns a boolean indicating whether the expenditure is fully funded,
 * i.e. the balance of each token is greater than or equal to the sum of its payouts
 */
export const isExpenditureFullyFunded = (expenditure?: Expenditure | null) => {
  if (!expenditure) {
    return false;
  }

  if (!expenditure.balances) {
    return false;
  }

  const slotAmountsByToken = expenditure.slots.flatMap((slot) => {
    const amounts: { tokenAddress: string; amount: BigNumber }[] = [];

    slot.payouts?.forEach((payout) => {
      if (!payout.isClaimed) {
        const existingAmountIndex = amounts.findIndex(
          (item) => item.tokenAddress === payout.tokenAddress,
        );
        if (existingAmountIndex !== -1) {
          amounts[existingAmountIndex].amount = BigNumber.from(
            amounts[existingAmountIndex].amount ?? 0,
          ).add(payout.amount);
        } else {
          amounts.push({
            tokenAddress: payout.tokenAddress,
            amount: BigNumber.from(payout.amount),
          });
        }
      }
    });

    return amounts;
  });

  return slotAmountsByToken.every(({ tokenAddress, amount }) => {
    const tokenBalance = expenditure.balances?.find(
      (balance) => balance.tokenAddress === tokenAddress,
    );

    return amount.lte(tokenBalance?.amount ?? 0);
  });
};
