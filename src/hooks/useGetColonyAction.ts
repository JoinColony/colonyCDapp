import { MotionState as NetworkMotionState } from '@colony/colony-js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useUserTokenBalanceContext } from '~context/UserTokenBalanceContext/UserTokenBalanceContext.ts';
import { FAILED_LOADING_DURATION as POLLING_TIMEOUT } from '~frame/LoadingTemplate/index.ts';
import {
  ColonyActionType,
  useGetColonyActionQuery,
  useGetMotionStateQuery,
} from '~gql';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { MotionState, getMotionState } from '~utils/colonyMotions.ts';
import { getMultiSigState } from '~utils/multiSig/index.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
import { isTransactionFormat } from '~utils/web3/index.ts';

export type RefetchMotionState = ReturnType<
  typeof useGetMotionStateQuery
>['refetch'];

export type RefetchAction = ReturnType<
  typeof useGetColonyActionQuery
>['refetch'];

const useGetColonyAction = (transactionHash?: string) => {
  const {
    colony: { colonyAddress },
    refetchColony,
  } = useColonyContext();
  const { refetchTokenBalances } = useUserTokenBalanceContext();

  const isInvalidTx = !isTransactionFormat(transactionHash);
  /* Unfortunately, we need to track polling state ourselves: https://github.com/apollographql/apollo-client/issues/9081#issuecomment-975722271 */
  const [isPolling, setIsPolling] = useState(!isInvalidTx);

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const pollInterval = getSafePollingInterval();

  const {
    data: actionData,
    loading: loadingAction,
    startPolling,
    stopPolling,
    refetch: refetchAction,
  } = useGetColonyActionQuery({
    skip: isInvalidTx,
    variables: {
      transactionHash: transactionHash ?? '',
    },
    pollInterval,
  });

  const action = actionData?.getColonyAction;

  const {
    loading: loadingExtensions,
    votingReputationExtensionData,
    multiSigExtensionData,
  } = useEnabledExtensions();

  const votingReputationExtensionIsUninstalled =
    !loadingExtensions && !votingReputationExtensionData;

  const multiSigExtensionIsUninstalled =
    !loadingExtensions && !multiSigExtensionData;

  const clearPollingCancellationTimer = () => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);

      pollTimerRef.current = null;
    }
  };

  const startPollingForAction = useCallback(() => {
    startPolling(pollInterval);
    setIsPolling(true);
    refetchAction();
  }, [pollInterval, startPolling, refetchAction]);

  const stopPollingForAction = useCallback(() => {
    stopPolling();
    setIsPolling(false);
  }, [stopPolling]);

  useEffect(() => {
    const shouldPoll = !isInvalidTx && !action;

    setIsPolling(shouldPoll);

    if (!shouldPoll) {
      if (action) {
        if (action.type === ColonyActionType.Payment) {
          refetchTokenBalances();
        }

        refetchColony();
      }

      return;
    }

    clearPollingCancellationTimer();

    pollTimerRef.current = setTimeout(stopPollingForAction, POLLING_TIMEOUT);

    startPollingForAction();
  }, [
    action,
    pollInterval,
    refetchColony,
    refetchTokenBalances,
    isInvalidTx,
    startPollingForAction,
    stopPollingForAction,
  ]);

  useEffect(() => {
    return () => {
      // The purpose of this is to isolate the concern of
      // cleaning up the timeout scheduled for stopping the polling,
      // and also to stop polling action polling altogether when the node unmounts.
      // This effect should receive an empty array dependency to ensure that
      // it only ever calls the return statement when its node unmounts,
      // and not when any other state gets updated.
      clearPollingCancellationTimer();

      stopPollingForAction();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const motionState = useMemo(() => {
    if (loadingMotionState || loadingExtensions) return undefined;
    if (action?.isMultiSig) {
      if (multiSigExtensionIsUninstalled) {
        return MotionState.Uninstalled;
      }
      return action?.multiSigData
        ? getMultiSigState(action?.multiSigData)
        : MotionState.Invalid;
    }

    if (votingReputationExtensionIsUninstalled) {
      return MotionState.Uninstalled;
    }

    return action?.motionData
      ? getMotionState(networkMotionState, action?.motionData)
      : MotionState.Invalid;
  }, [
    action?.isMultiSig,
    action?.motionData,
    action?.multiSigData,
    loadingExtensions,
    loadingMotionState,
    multiSigExtensionIsUninstalled,
    networkMotionState,
    votingReputationExtensionIsUninstalled,
  ]);

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
    loadingAction:
      loadingAction ||
      (isPolling && !action) ||
      loadingMotionState ||
      loadingExtensions,
    action,
    startPollingForAction,
    stopPollingForAction,
    networkMotionState,
    motionState,
    refetchMotionState,
    refetchAction,
  };
};

export default useGetColonyAction;
