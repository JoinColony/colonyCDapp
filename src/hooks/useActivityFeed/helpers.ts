import { isHexString } from 'ethers/lib/utils';

import { ColonyActionType, type ColonyFragment } from '~gql';
import { type MotionStatesMap } from '~hooks/useNetworkMotionStates.ts';
import { type AnyActionType } from '~types/actions.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { getExtendedActionType } from '~utils/colonyActions.ts';
import { getMotionState, MotionState } from '~utils/colonyMotions.ts';
import { getMultiSigState } from '~utils/multiSig.ts';

import {
  ActivityDecisionMethod,
  type ActivityFeedFilters,
  type ActivityFeedColonyAction,
  type SearchActionsFilterVariable,
} from './types.ts';

const getActivityFeedMotionState = (
  action: ColonyAction,
  motionStatesMap: MotionStatesMap,
): MotionState | undefined => {
  if (action.isMultiSig) {
    return getMultiSigState(action.multiSigData);
  }

  if (!action.motionData) {
    return MotionState.Passed;
  }

  const networkMotionState = motionStatesMap.get(action.motionData.motionId);

  if (networkMotionState === null) {
    return MotionState.Uninstalled;
  }

  return networkMotionState !== undefined
    ? getMotionState(networkMotionState, action.motionData)
    : MotionState.Invalid;
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
  colony: ColonyFragment,
  search?: string,
) => {
  if (!search) {
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

const ACTION_TYPES_TO_HIDE = [
  ColonyActionType.CancelExpenditure,
  ColonyActionType.CancelExpenditureMotion,
  ColonyActionType.LockExpenditure,
  ColonyActionType.FinalizeExpenditure,
  ColonyActionType.FinalizeExpenditureMotion,
  ColonyActionType.FundExpenditureMotion,
  ColonyActionType.SetExpenditureStateMotion,
  ColonyActionType.EditExpenditure,
  ColonyActionType.EditExpenditureMotion,
];

export const filterByActionTypes = (
  action: ActivityFeedColonyAction,
  colony: ColonyFragment | undefined,
  actionTypes?: AnyActionType[],
) => {
  if (ACTION_TYPES_TO_HIDE.includes(action.type)) {
    return false;
  }

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

/**
 * Common filtering for all action queries to ensure both listing and counting queries
 * return the same results
 */
export const getBaseSearchActionsFilterVariable = (
  colonyAddress: string,
): SearchActionsFilterVariable => ({
  colonyId: {
    eq: colonyAddress,
  },
  showInActionsList: {
    eq: true,
  },
  isMotionFinalization: {
    ne: true,
  },
});

export const getSearchActionsFilterVariable = (
  colonyAddress: string,
  { dateFrom, dateTo, decisionMethod, teamId }: ActivityFeedFilters = {},
): SearchActionsFilterVariable => {
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
    ...getBaseSearchActionsFilterVariable(colonyAddress),
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
  (
    motionStatesMap: MotionStatesMap,
    isVotingRepExtensionInstalled: boolean | null,
    isMultiSigExtensionInstalled: boolean | null,
  ) =>
  (action: ColonyAction): ActivityFeedColonyAction => {
    let motionState;
    if (action.isMultiSig && !isMultiSigExtensionInstalled) {
      motionState = MotionState.Uninstalled;
    } else if (action.isMotion && !isVotingRepExtensionInstalled) {
      motionState = MotionState.Uninstalled;
    } else {
      motionState = getActivityFeedMotionState(action, motionStatesMap);
    }

    return {
      ...action,
      motionState,
    };
  };
