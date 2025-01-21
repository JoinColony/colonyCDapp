import React, { type PropsWithChildren, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { TX_SEARCH_PARAM } from '~routes';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';

import { ActionContext, type IActionContext } from './ActionContext.ts';

const ActionContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [searchParams] = useSearchParams();

  const transactionHash = searchParams?.get(TX_SEARCH_PARAM);

  const {
    action,
    loadingAction,
    motionState,
    refetchMotionState,
    isValidTransactionHash,
    networkMotionState,
    startActionPoll,
    stopActionPoll,
    expenditure,
    loadingExpenditure,
  } = useGetColonyAction(transactionHash);

  const value = useMemo<IActionContext>(
    () => ({
      transactionHash,
      action,
      loadingAction,
      expenditure,
      motionData: action?.motionData,
      multiSigData: action?.multiSigData,
      loadingExpenditure,
      motionState,
      refetchMotionState,
      isValidTransactionHash,
      networkMotionState,
      startActionPoll,
      stopActionPoll,
      isMotion: !!action?.motionData,
      isMultiSig: !!action?.multiSigData,
      isExpenditure: !!action?.expenditure,
    }),
    [
      action,
      expenditure,
      isValidTransactionHash,
      loadingAction,
      loadingExpenditure,
      motionState,
      networkMotionState,
      refetchMotionState,
      startActionPoll,
      stopActionPoll,
      transactionHash,
    ],
  );

  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  );
};

export default ActionContextProvider;
