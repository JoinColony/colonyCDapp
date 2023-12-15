import { isHexString } from 'ethers/lib/utils';
import { ColonyFragment, QuerySearchColonyActionsArgs } from '~gql';
import { MotionStatesMap } from '~hooks';
import { AnyActionType, ColonyAction } from '~types';
import { notMaybe } from '~utils/arrays';
import { getExtendedActionType } from '~utils/colonyActions';
import { MotionState, getMotionState } from '~utils/colonyMotions';

import {
  ActivityDecisionMethod,
  ActivityFeedFilters,
  ActivityFeedColonyAction,
} from './types';

const getActivityFeedMotionState = (
  action: ColonyAction,
  motionStatesMap: MotionStatesMap,
): MotionState | undefined => {
  if (!action.motionData) {
    return MotionState.Passed;
  }

  const networkMotionState = motionStatesMap.get(action.motionData.motionId);

  return networkMotionState
    ? getMotionState(networkMotionState, action.motionData)
    : undefined;
};

export const filterActionByMotionState = (
  action: ActivityFeedColonyAction,
  motionStatesFilter?: MotionState[],
) => {
  if (!motionStatesFilter) {
    return true;
  }

  return !action.motionState
    ? false
    : motionStatesFilter.includes(action.motionState);
};

export const filterBySearch = (
  action: ActivityFeedColonyAction,
  colony: ColonyFragment | undefined,
  search?: string,
) => {
  if (!search || !colony) {
    return true;
  }

  const {
    isMotion,
    pendingColonyMetadata,
    metadata,
    amount,
    token,
    initiatorUser,
    recipientUser,
    transactionHash,
    initiatorAddress,
    recipientAddress,
  } = action;

  const extendedActionType = getExtendedActionType(
    action,
    isMotion ? pendingColonyMetadata : colony.metadata,
  );

  const searchValue = search.toLowerCase();
  const searchIsAddress = isHexString(searchValue);
  const terms = searchIsAddress
    ? [transactionHash, initiatorAddress, recipientAddress, token?.tokenAddress]
    : [
        metadata?.customTitle,
        extendedActionType,
        amount,
        token?.name,
        token?.symbol,
        initiatorUser?.profile?.displayName,
        recipientUser?.profile?.displayName,
      ];

  return terms.filter(notMaybe).some((term) => {
    const lowercaseTerm = term.toLowerCase();

    return searchIsAddress
      ? lowercaseTerm === search
      : lowercaseTerm.includes(searchValue);
  });
};

export const filterByActionTypes = (
  action: ActivityFeedColonyAction,
  colony: ColonyFragment | undefined,
  actionTypes?: AnyActionType[],
) => {
  if (!actionTypes || !colony || !actionTypes.length) {
    return true;
  }

  const { isMotion, pendingColonyMetadata } = action;

  const extendedActionType = getExtendedActionType(
    action,
    isMotion ? pendingColonyMetadata : colony.metadata,
  );

  return actionTypes.includes(extendedActionType);
};

export const createBaseActionFilter = (colonyAddress: string) => ({
  colonyId: {
    eq: colonyAddress,
  },
  showInActionsList: {
    eq: true,
  },
  colonyDecisionId: {
    exists: false,
  },
});

export const getSearchActionsFilterVariable = (
  colonyAddress: string,
  { dateFrom, dateTo, decisionMethod, teamId }: ActivityFeedFilters = {},
): QuerySearchColonyActionsArgs['filter'] => {
  const dateFilter =
    dateFrom && dateTo
      ? {
          createdAt: {
            range: [dateFrom?.toISOString(), dateTo?.toISOString()],
          },
        }
      : {
          ...(dateFrom
            ? {
                createdAt: {
                  gte: dateFrom?.toISOString(),
                },
              }
            : {}),
          ...(dateTo
            ? {
                createdAt: {
                  lte: dateTo?.toISOString(),
                },
              }
            : {}),
        };
  const decisionMethodFilter =
    decisionMethod !== undefined
      ? {
          ...(decisionMethod === ActivityDecisionMethod.Reputation
            ? {
                isMotion: {
                  eq: true,
                },
              }
            : {}),
          ...(decisionMethod === ActivityDecisionMethod.Permissions
            ? {
                isMotion: {
                  ne: true,
                },
              }
            : {}),
        }
      : undefined;

  return {
    ...createBaseActionFilter(colonyAddress),
    ...(teamId !== undefined ? { fromDomainId: { eq: teamId } } : {}),
    ...dateFilter,
    ...(decisionMethodFilter || {}),
  };
};

export const getActionsByPageNumber = (
  actions: ColonyAction[],
  pageNumber: number,
  itemsPerPage: number,
) => {
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return actions.slice(startIndex, endIndex);
};

export const makeWithMotionStateMapper =
  (motionStatesMap: MotionStatesMap) =>
  (action: ColonyAction): ActivityFeedColonyAction => ({
    ...action,
    motionState: getActivityFeedMotionState(action, motionStatesMap),
  });
