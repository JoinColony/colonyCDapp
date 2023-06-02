import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { failedLoadingDuration as pollingTimeout } from '~frame/LoadingTemplate';
import { useGetColonyActionQuery, useGetMotionStateQuery } from '~gql';
import { isTransactionFormat } from '~utils/web3';
import { useColonyContext } from '~hooks';

import { ActionDetailsPageParams } from './ActionDetailsPage';

export type RefetchMotionState = ReturnType<
  typeof useGetMotionStateQuery
>['refetch'];

export type RefetchAction = ReturnType<
  typeof useGetColonyActionQuery
>['refetch'];

export const useGetColonyAction = () => {
  const { colony, refetchColony } = useColonyContext();
  const { transactionHash } = useParams<ActionDetailsPageParams>();
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

  useEffect(() => {
    const cancelPollingTimer = setTimeout(stopPollingForAction, pollingTimeout);
    return () => clearTimeout(cancelPollingTimer);
  }, [stopPollingForAction]);

  /** Refetch colony when the action loads to update
   * any fields that might have been modified by the action
   */
  useEffect(() => {
    if (!actionData?.getColonyAction) {
      return;
    }

    refetchColony();
  }, [actionData, refetchColony]);

  const { state: locationState } = useLocation();
  /* Don't poll if we've not been redirected from the saga */
  const isRedirect = locationState?.isRedirect;
  const action = actionData?.getColonyAction;
  const shouldStopPolling = (!isRedirect && isPolling) || (action && isPolling);

  if (shouldStopPolling) {
    stopPollingForAction();
    setIsPolling(false);
  }

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
        transactionHash: transactionHash ?? '',
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
