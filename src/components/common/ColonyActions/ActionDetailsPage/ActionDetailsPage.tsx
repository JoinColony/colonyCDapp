import React from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext, useGetColonyAction } from '~hooks';
import LoadingTemplate from '~frame/LoadingTemplate';

import {
  TransactionNotFound,
  ActionDetailsPageLayout as Layout,
  DefaultAction,
  DefaultMotion,
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
  } = useGetColonyAction(colony);

  // const status = action?.transactionStatus;
  if (!colony) {
    return null;
  }

  const isMotion = action?.isMotion;
  const createdAt = action?.createdAt;
  const isInvalidTransaction =
    isInvalidTransactionHash || isUnknownTransaction || !action;

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
        <DefaultMotion item={action} />
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
