import { useEffect, useState } from 'react';

import { failedLoadingDuration as pollingTimeout } from '~frame/LoadingTemplate';
import {
  ColonyActionType,
  useGetColonyActionQuery,
  useGetMotionStateQuery,
} from '~gql';
import { isTransactionFormat } from '~utils/web3';
import { useColonyContext } from '~hooks';
import { useUserTokenBalanceContext } from '~context';
import noop from '~utils/noop';

export type RefetchMotionState = ReturnType<
  typeof useGetMotionStateQuery
>['refetch'];

export type RefetchAction = ReturnType<
  typeof useGetColonyActionQuery
>['refetch'];

export const useGetColonyAction = (transactionHash?: string) => {
  const { colony, refetchColony } = useColonyContext();
  const { refetchTokenBalances } = useUserTokenBalanceContext();
  const isValidTx = isTransactionFormat(transactionHash);
  const skipQuery = !colony || !isValidTx;
  /* Unfortunately, we need to track polling state ourselves: https://github.com/apollographql/apollo-client/issues/9081#issuecomment-975722271 */
  const [isPolling, setIsPolling] = useState(!skipQuery);

  const {
    data: actionData,
    loading: loadingAction,
    startPolling: startPollingForAction,
    stopPolling: stopPollingForAction,
    refetch: refetchAction,
  } = useGetColonyActionQuery({
    skip: skipQuery,
    variables: {
      transactionHash: transactionHash ?? '',
    },
    pollInterval: 1000,
  });

  const action = actionData?.getColonyAction;

  useEffect(() => {
    const shouldPool = !skipQuery && !action;

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

    startPollingForAction(1000);

    return () => {
      if (cancelPollingTimer) {
        clearTimeout(cancelPollingTimer);
      }

      stopPollingForAction();
    };
  }, [
    action,
    refetchColony,
    refetchTokenBalances,
    skipQuery,
    startPollingForAction,
    stopPollingForAction,
  ]);

  const {
    data: motionStateData,
    loading: loadingMotionState,
    refetch: refetchMotionState,
  } = useGetMotionStateQuery({
    skip: !action?.motionData || skipQuery,
    variables: {
      input: {
        colonyAddress: colony?.colonyAddress ?? '',
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
    isInvalidTransactionHash: !isValidTx,
    isUnknownTransaction:
      isValidTx && action?.colony?.colonyAddress !== colony?.colonyAddress,
    loadingAction: loadingAction || isPolling || loadingMotionState,
    action,
    startPollingForAction,
    stopPollingForAction,
    motionState: motionStateData?.getMotionState,
    refetchMotionState,
    refetchAction,
  };
};
