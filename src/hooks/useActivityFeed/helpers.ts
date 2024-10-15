import { isHexString } from 'ethers/lib/utils';

import { ColonyActionType, type ColonyFragment } from '~gql';
import { type MotionStatesMap } from '~hooks/useNetworkMotionStates.ts';
import { type AnyActionType } from '~types/actions.ts';
import { type InstalledExtensionData } from '~types/extensions.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { getExtendedActionType } from '~utils/colonyActions.ts';
import { getMotionState, MotionState } from '~utils/colonyMotions.ts';
import { getMultiSigState } from '~utils/multiSig/index.ts';

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
  ColonyActionType.ReleaseStagedPaymentsMotion,
  ColonyActionType.ReleaseStagedPayments,
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
  { dateFrom, dateTo, decisionMethods, teamId }: ActivityFeedFilters = {},
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
    decisionMethods && !!decisionMethods.length
      ? {
          or: [
            ...(decisionMethods.includes(ActivityDecisionMethod.Reputation)
              ? [
                  {
                    isMotion: {
                      eq: true,
                    },
                  },
                ]
              : []),
            ...(decisionMethods.includes(ActivityDecisionMethod.MultiSig)
              ? [
                  {
                    isMultiSig: {
                      eq: true,
                    },
                  },
                ]
              : []),
            ...(decisionMethods.includes(ActivityDecisionMethod.Permissions)
              ? [
                  {
                    isMotion: {
                      ne: true,
                    },
                    isMultiSig: {
                      ne: true,
                    },
                  },
                ]
              : []),
          ],
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
    votingRepExtensionData: InstalledExtensionData | undefined,
    multiSigExtensionData: InstalledExtensionData | undefined,
  ) =>
  (action: ColonyAction): ActivityFeedColonyAction => {
    let motionState;
    // If the action is multi sig, and the multi sig extension was uninstalled.
    if (action.isMultiSig && !multiSigExtensionData) {
      motionState = MotionState.Uninstalled;
    }
    // If the action is a motion, and the voting with reputation extension was uninstalled.
    else if (action.isMotion && !votingRepExtensionData) {
      motionState = MotionState.Uninstalled;
    }

    // If the action is a motion, but was created with an old uninstalled extension.
    else if (
      action.isMotion &&
      action.motionData?.createdBy !== votingRepExtensionData?.address
    ) {
      motionState = MotionState.Uninstalled;
    }

    // Otherwise, get the state in a normal way.
    else {
      motionState = getActivityFeedMotionState(action, motionStatesMap);
    }

    return {
      ...action,
      motionState,
    };
  };
