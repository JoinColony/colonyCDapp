import React from 'react';
import { defineMessages } from 'react-intl';
import { MotionState as NetworkMotionState } from '@colony/colony-js';

import { useColonyContext } from '~hooks';
import LoadingTemplate from '~frame/LoadingTemplate';

import {
  TransactionNotFound,
  ActionDetailsPageLayout as Layout,
  DefaultAction,
  DefaultMotion,
  useGetColonyAction,
} from '.';

const displayName = 'common.ColonyActions.ActionDetailsPage';

const MSG = defineMessages({
  loading: {
    id: `${displayName}.loading`,
    defaultMessage: `Loading Transaction`,
  },
  unknownTransaction: {
    id: `${displayName}.unknownTransaction`,
    defaultMessage: `Unknown Transaction`,
  },
});

export type ActionDetailsPageParams = Record<
  'colonyName' | 'transactionHash',
  string
>;

const ActionDetailsPage = () => {
  const { colony } = useColonyContext();
  const {
    isInvalidTransactionHash,
    isUnknownTransaction,
    action,
    loadingAction,
    motionState,
    refetchMotionState,
    startPollingForAction,
    stopPollingForAction,
  } = useGetColonyAction(colony);

  // const status = action?.transactionStatus;
  if (!colony) {
    return null;
  }

  const isMotion = action?.isMotion;
  const createdAt = action?.createdAt;
  const isInvalidMotion =
    (isMotion && !action.motionData) || (isMotion && motionState === undefined);

  const isInvalidTransaction =
    isInvalidTransactionHash ||
    isUnknownTransaction ||
    !action ||
    isInvalidMotion;

  if (loadingAction) {
    return <LoadingTemplate loadingText={MSG.loading} />;
  }

  if (isInvalidTransaction) {
    return (
      <Layout center>
        <TransactionNotFound
          colonyName={colony.name}
          createdAt={createdAt}
          // status={status}
          isUnknownTx={isUnknownTransaction}
        />
      </Layout>
    );
  }

  if (isMotion) {
    return (
      <Layout isMotion>
        <DefaultMotion
          actionData={action}
          // Safe casting since if it's a motion without motionState, we render TransactionNotFound.
          networkMotionState={motionState as NetworkMotionState}
          refetchMotionState={refetchMotionState}
          startPollingAction={startPollingForAction}
          stopPollingAction={stopPollingForAction}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <DefaultAction actionData={action} />
    </Layout>
  );
};

ActionDetailsPage.displayName = displayName;

export default ActionDetailsPage;
