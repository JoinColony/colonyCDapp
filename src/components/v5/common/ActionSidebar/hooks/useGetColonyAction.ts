import { MotionState as NetworkMotionState } from '@colony/colony-js';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  useGetColonyActionQuery,
  useGetMotionStateQuery,
  useOnCreateAnnotationSubscription,
  useOnCreateMultiSigUserSignatureSubscription,
  useOnDeleteMultiSigUserSignatureSubscription,
  useOnUpdateColonyMotionSubscription,
  useOnUpdateColonyMultiSigSubscription,
} from '~gql';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { type OptionalValue } from '~types';
import { MotionState, getMotionState } from '~utils/colonyMotions.ts';
import { getMultiSigState } from '~utils/multiSig/index.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
import { isTransactionFormat } from '~utils/web3/index.ts';

import { useGetExpenditureData } from './useGetExpenditureData.ts';

export type RefetchMotionState = ReturnType<
  typeof useGetMotionStateQuery
>['refetch'];

export type RefetchAction = ReturnType<
  typeof useGetColonyActionQuery
>['refetch'];

const pollInterval = getSafePollingInterval();

const useGetColonyAction = (transactionHash: OptionalValue<string>) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const isValidTx = isTransactionFormat(transactionHash);

  /* Unfortunately, we need to track polling state ourselves: https://github.com/apollographql/apollo-client/issues/9081#issuecomment-975722271 */
  const [isPolling, setIsPolling] = useState(isValidTx);

  const [hasPendingAnnotation, setHasPendingAnnotation] = useState(false);

  const {
    data: actionData,
    loading: loadingAction,
    called: actionCalled,
    startPolling,
    stopPolling,
    refetch: refetchAction,
  } = useGetColonyActionQuery({
    skip: !isValidTx,
    variables: {
      transactionHash: transactionHash ?? '',
    },
  });

  const action = actionData?.getColonyAction;

  const { expenditure, loadingExpenditure } = useGetExpenditureData(
    action?.expenditureId,
  );

  const {
    loading: loadingExtensions,
    votingReputationExtensionData,
    multiSigExtensionData,
  } = useEnabledExtensions();

  const votingReputationExtensionIsUninstalled =
    !loadingExtensions && !votingReputationExtensionData;

  const multiSigExtensionIsUninstalled =
    !loadingExtensions && !multiSigExtensionData;

  const startActionPoll = useCallback(() => {
    startPolling(pollInterval);
    setIsPolling(true);
  }, [startPolling]);

  const stopActionPoll = useCallback(() => {
    stopPolling();
    setIsPolling(false);
  }, [stopPolling]);

  const {
    data: motionStateData,
    loading: loadingMotionState,
    refetch: refetchMotionState,
  } = useGetMotionStateQuery({
    skip: !action?.motionData || !isValidTx,
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

  const updateAction = async () => {
    const previousActionData = actionData?.getColonyAction;

    const newActionData = (await refetchAction()).data.getColonyAction;

    if (JSON.stringify(previousActionData) !== JSON.stringify(newActionData)) {
      await refetchMotionState();
    }
  };

  useOnUpdateColonyMotionSubscription({
    onData: updateAction,
  });

  useOnUpdateColonyMultiSigSubscription({
    onData: updateAction,
  });

  useOnCreateMultiSigUserSignatureSubscription({
    onData: updateAction,
  });

  useOnDeleteMultiSigUserSignatureSubscription({
    onData: updateAction,
  });

  useOnCreateAnnotationSubscription({
    onData: () => setHasPendingAnnotation(true),
  });

  useEffect(() => {
    if (
      (hasPendingAnnotation && !action?.annotation) ||
      (!actionData?.getColonyAction?.metadata && actionCalled)
    ) {
      startActionPoll();
    } else {
      setHasPendingAnnotation(false);
      stopActionPoll();
    }

    return stopActionPoll;
  }, [
    action,
    action?.annotation,
    hasPendingAnnotation,
    startActionPoll,
    stopActionPoll,
    actionCalled,
    actionData?.getColonyAction,
  ]);

  return {
    isValidTransactionHash: isValidTx,
    isInvalidTransactionHash: !isValidTx && !!transactionHash,
    isUnknownTransaction:
      isValidTx && action?.colony?.colonyAddress !== colonyAddress,
    loadingAction:
      loadingAction ||
      hasPendingAnnotation ||
      (isPolling && !action) ||
      loadingMotionState ||
      loadingExtensions,
    action,
    startActionPoll,
    stopActionPoll,
    networkMotionState,
    motionState,
    refetchMotionState,
    refetchAction,
    expenditure,
    loadingExpenditure,
  };
};

export default useGetColonyAction;
