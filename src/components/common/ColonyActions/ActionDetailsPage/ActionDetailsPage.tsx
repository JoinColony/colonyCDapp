import { MotionState as NetworkMotionState } from '@colony/colony-js';
import React from 'react';
import { defineMessages } from 'react-intl';

import LoadingTemplate from '~frame/LoadingTemplate';
import { useColonyContext } from '~hooks';
import { MotionAction } from '~types/motions';

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
    refetchAction,
  } = useGetColonyAction();

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
          isUnknownTx={isUnknownTransaction}
        />
      </Layout>
    );
  }

  if (isMotion) {
    return (
      <Layout isMotion actionData={action}>
        <DefaultMotion
          // Safe castings since if it's a motion without motionState/data, we render TransactionNotFound.
          actionData={action as MotionAction}
          networkMotionState={motionState as NetworkMotionState}
          refetchMotionState={refetchMotionState}
          startPollingAction={startPollingForAction}
          stopPollingAction={stopPollingForAction}
          refetchAction={refetchAction}
        />
      </Layout>
    );
  }

  return (
    <Layout actionData={action}>
      <DefaultAction actionData={action} />
    </Layout>
  );
};

ActionDetailsPage.displayName = displayName;

export default ActionDetailsPage;
