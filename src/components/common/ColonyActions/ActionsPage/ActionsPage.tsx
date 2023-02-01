import React from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import { isTransactionFormat } from '~utils/web3';
import { useColonyContext } from '~hooks';
import LoadingTemplate from '~frame/LoadingTemplate';

import { mockActionData } from '../mockData';
import { TransactionNotFound, ActionsPageLayout, DefaultAction } from '.';

const displayName = '~common.ColonyActions.ActionsPage';

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

type ActionsPageParams = Record<'colonyName' | 'transactionHash', string>;

const ActionsPage = () => {
  const { colony } = useColonyContext();
  const { transactionHash } = useParams<ActionsPageParams>();
  const loading = false;
  const dummyAction = mockActionData[0];
  const { createdAt, transactionStatus: status } = dummyAction;
  const isValidTx = isTransactionFormat(transactionHash);
  const events = []; // to be taken from real data

  if (!colony) {
    return null;
  }

  if (!isValidTx || !events?.length) {
    return (
      <ActionsPageLayout>
        <TransactionNotFound
          colonyName={colony.name}
          transactionHash={transactionHash}
          createdAt={createdAt.valueOf()}
          status={status}
          isUnknownTx={!events?.length && isValidTx}
        />
      </ActionsPageLayout>
    );
  }

  if (loading) {
    return <LoadingTemplate loadingText={MSG.loading} />;
  }

  return (
    <ActionsPageLayout>
      <DefaultAction />
    </ActionsPageLayout>
  );
};

ActionsPage.displayName = displayName;

export default ActionsPage;
