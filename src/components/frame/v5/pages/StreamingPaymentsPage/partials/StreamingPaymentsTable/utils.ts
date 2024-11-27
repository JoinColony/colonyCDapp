import { BigNumber } from 'ethers';

import { ModelSortDirection, type StreamingPaymentEndCondition } from '~gql';
import { type ColonyContributor } from '~types/graphql.ts';
import { StreamingPaymentStatus } from '~types/streamingPayments.ts';

import { type StreamingPaymentFilters } from './partials/StreamingPaymentFilters/types.ts';
import { type StreamingTableFieldModel } from './types.ts';

export const searchStreamingPayments = (
  streamingPayment: StreamingTableFieldModel,
  members: ColonyContributor[],
  searchValue?: string,
): StreamingTableFieldModel | null => {
  if (!searchValue) {
    return streamingPayment;
  }

  const searchedMembers = members.filter(
    (member) =>
      member.user?.profile?.displayName
        ?.toLowerCase()
        .startsWith(searchValue.toLowerCase()) ||
      member.contributorAddress.startsWith(searchValue),
  );

  const member = searchedMembers.find(
    (searchedMember) =>
      searchedMember.contributorAddress === streamingPayment.user,
  );
  const filteredActions = streamingPayment.actions.filter((action) =>
    action.title.startsWith(searchValue),
  );

  if (member) {
    return {
      user: streamingPayment.user,
      tokenTotalsPerMonth: streamingPayment.tokenTotalsPerMonth,
      actions: streamingPayment.actions,
    };
  }

  if (filteredActions.length > 0) {
    return {
      user: streamingPayment.user,
      tokenTotalsPerMonth: streamingPayment.tokenTotalsPerMonth,
      actions: filteredActions,
    };
  }

  return null;
};

export const filterByActionStatus = (
  action: StreamingTableFieldModel,
  statuses?: StreamingPaymentStatus[],
): StreamingTableFieldModel | null => {
  if (!statuses) {
    return action;
  }

  const filteredActions = action.actions.filter((actionItem) =>
    statuses.includes(actionItem.status),
  );

  if (filteredActions.length > 0) {
    return {
      user: action.user,
      tokenTotalsPerMonth: action.tokenTotalsPerMonth,
      actions: filteredActions,
    };
  }

  return null;
};

export const filterByEndCondition = (
  action: StreamingTableFieldModel,
  endConditions?: StreamingPaymentEndCondition[],
): StreamingTableFieldModel | null => {
  if (!endConditions) {
    return action;
  }

  const filteredActions = action.actions.filter((actionItem) => {
    const { endCondition } = actionItem || {};

    if (!endCondition) {
      return false;
    }

    return endConditions.includes(endCondition);
  });

  if (filteredActions.length > 0) {
    return {
      ...action,
      actions: filteredActions,
    };
  }

  return null;
};

export const sortStreamingPayments = (
  actions: StreamingTableFieldModel[],
  activeFilters: StreamingPaymentFilters,
) =>
  actions.sort((a, b) => {
    const totalStreamedFilter = activeFilters.totalStreamedFilters;

    if (totalStreamedFilter) {
      const aTotalStreamed = a.actions.reduce(
        (acc, { totalStreamedAmount }) =>
          acc.add(BigNumber.from(totalStreamedAmount)),
        BigNumber.from(0),
      );
      const bTotalStreamed = b.actions.reduce(
        (acc, { totalStreamedAmount }) =>
          acc.add(BigNumber.from(totalStreamedAmount)),
        BigNumber.from(0),
      );

      if (totalStreamedFilter === ModelSortDirection.Asc) {
        return aTotalStreamed.lt(bTotalStreamed) ? -1 : 1;
      }
      return aTotalStreamed.gt(bTotalStreamed) ? -1 : 1;
    }

    const aHasActive = a.actions.some(
      (action) => action.status === StreamingPaymentStatus.Active,
    );
    const bHasActive = b.actions.some(
      (action) => action.status === StreamingPaymentStatus.Active,
    );

    if (aHasActive === bHasActive) {
      return 0;
    }
    return aHasActive ? -1 : 1;
  });
