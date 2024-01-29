import { useEffect, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { useUserTokenBalanceContext } from '~context/UserTokenBalanceContext.tsx';
import { failedLoadingDuration as pollingTimeout } from '~frame/LoadingTemplate/index.ts';
import {
  ColonyActionType,
  useGetColonyActionQuery,
  useGetMotionStateQuery,
} from '~gql';
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

    const cancelPollingTimer = setTimeout(stopPollingForAction, pollingTimeout);

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
    motionState: motionStateData?.getMotionState,
    refetchMotionState,
    refetchAction,
  };
};
