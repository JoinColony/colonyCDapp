import { MotionState as NetworkMotionState } from '@colony/colony-js';
import { useEffect, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useUserTokenBalanceContext } from '~context/UserTokenBalanceContext/UserTokenBalanceContext.ts';
import { FAILED_LOADING_DURATION as POLLING_TIMEOUT } from '~frame/LoadingTemplate/index.ts';
import {
  ColonyActionType,
  useGetColonyActionQuery,
  useGetMotionStateQuery,
} from '~gql';
import { MotionState, getMotionState } from '~utils/colonyMotions.ts';
import noop from '~utils/noop.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
import { isTransactionFormat } from '~utils/web3/index.ts';

export type RefetchMotionState = ReturnType<
  typeof useGetMotionStateQuery
>['refetch'];

export type RefetchAction = ReturnType<
  typeof useGetColonyActionQuery
>['refetch'];

export const useGetColonyAction = (transactionHash?: string) => {
  const {
    colony: { colonyAddress },
    refetchColony,
  } = useColonyContext();
  const { refetchTokenBalances } = useUserTokenBalanceContext();
  const isInvalidTx = !isTransactionFormat(transactionHash);
  /* Unfortunately, we need to track polling state ourselves: https://github.com/apollographql/apollo-client/issues/9081#issuecomment-975722271 */
  const [isPolling, setIsPolling] = useState(!isInvalidTx);

  const pollInterval = getSafePollingInterval();

  const {
    data: actionData,
    loading: loadingAction,
    startPolling: startPollingForAction,
    stopPolling: stopPollingForAction,
    refetch: refetchAction,
  } = useGetColonyActionQuery({
    skip: isInvalidTx,
    variables: {
      transactionHash: transactionHash ?? '',
    },
    pollInterval,
  });

  const action = actionData?.getColonyAction;

  useEffect(() => {
    const shouldPool = !isInvalidTx && !action;

    setIsPolling(shouldPool);

    if (!shouldPool) {
      if (action) {
        if (action.type === ColonyActionType.Payment) {
          refetchTokenBalances();
        }

        refetchColony();
      }

      return noop;
    }

    const cancelPollingTimer = setTimeout(
      stopPollingForAction,
      POLLING_TIMEOUT,
    );

    startPollingForAction(pollInterval);

    return () => {
      if (cancelPollingTimer) {
        clearTimeout(cancelPollingTimer);
      }

      stopPollingForAction();
    };
  }, [
    action,
    pollInterval,
    refetchColony,
    refetchTokenBalances,
    isInvalidTx,
    startPollingForAction,
    stopPollingForAction,
  ]);

  const {
    data: motionStateData,
    loading: loadingMotionState,
    refetch: refetchMotionState,
  } = useGetMotionStateQuery({
    skip: !action?.motionData || isInvalidTx,
    variables: {
      input: {
        colonyAddress,
        databaseMotionId: action?.motionData?.databaseMotionId ?? '',
      },
    },
    onCompleted: () => {
      /* Keeps action data in sync when staker rewards are updated by this query */
      refetchAction();
    },
  });

  /**
   * @TODO: Once we properly store motion state in the DB, we need to consolidate
   * the 2 different motion states
   */
  const networkMotionState = (motionStateData?.getMotionState ??
    NetworkMotionState.Null) as NetworkMotionState;
  const motionState = action?.motionData
    ? getMotionState(networkMotionState, action?.motionData)
    : MotionState.Invalid;

  /* Ensures motion state is kept in sync with motion data */
  useEffect(() => {
    if (action?.motionData) {
      refetchMotionState();
    }
  }, [action?.motionData, refetchMotionState]);

  return {
    isInvalidTransactionHash: isInvalidTx,
    isUnknownTransaction:
      !isInvalidTx && action?.colony?.colonyAddress !== colonyAddress,
    loadingAction: loadingAction || isPolling || loadingMotionState,
    action,
    startPollingForAction,
    stopPollingForAction,
    networkMotionState,
    motionState,
    refetchMotionState,
    refetchAction,
  };
};
