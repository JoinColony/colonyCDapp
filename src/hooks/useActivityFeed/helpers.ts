import { MotionStatesMap } from '~hooks';
import { ColonyAction } from '~types';
import { MotionState, getMotionState } from '~utils/colonyMotions';

import {
  ActivityDecisionMethod,
  ActivityFeedFilters,
  ActivityFeedColonyAction,
  SearchActionsFilterVariable,
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
  colonyDecisionId: {
    exists: false,
  },
});

export const getSearchActionsFilterVariable = (
  colonyAddress: string,
  filters?: ActivityFeedFilters,
): SearchActionsFilterVariable => {
  return {
    ...getBaseSearchActionsFilterVariable(colonyAddress),
    fromDomainId: filters?.teamId
      ? {
          eq: filters.teamId,
        }
      : undefined,
    or: filters?.actionTypes?.length
      ? filters.actionTypes.map((actionType) => ({
          type: { eq: actionType },
        }))
      : undefined,
    createdAt: {
      range: [
        filters?.dateFrom?.toISOString() ?? null,
        filters?.dateTo?.toISOString() ?? null,
      ],
    },
    isMotion: {
      eq:
        filters?.decisionMethod === ActivityDecisionMethod.Reputation
          ? true
          : undefined,
      ne:
        filters?.decisionMethod === ActivityDecisionMethod.Permissions
          ? true
          : undefined,
    },
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
