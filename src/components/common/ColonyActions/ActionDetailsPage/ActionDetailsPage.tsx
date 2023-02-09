import React from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import { isTransactionFormat } from '~utils/web3';
import { useColonyContext } from '~hooks';
import LoadingTemplate from '~frame/LoadingTemplate';
import { useGetFullColonyByAddressQuery, useGetColonyActionQuery } from '~gql';

import {
  TransactionNotFound,
  ActionDetailsPageLayout as Layout,
  DefaultAction,
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

type ActionDetailsPageParams = Record<'colonyName' | 'transactionHash', string>;

const ActionDetailsPage = () => {
  const { colony } = useColonyContext();
  const { transactionHash, colonyName } = useParams<ActionDetailsPageParams>();

  const { data, loading } = useGetColonyActionQuery({
    variables: {
      transactionHash: transactionHash ?? '',
    },
    skip: !transactionHash,
  });
  const action = data?.getColonyAction;
  const { createdAt } = action || {};
  // const status = action?.transactionStatus;

  const isValidTx = isTransactionFormat(transactionHash);
  const events = ['event']; // to be taken from real data

  const { data: colonyData, loading: loadingColony } =
    useGetFullColonyByAddressQuery({
      variables: {
        address: action?.colonyAddress ?? '',
      },
      skip: !action?.colonyAddress,
    });
  const txColony = colonyData?.getColonyByAddress?.items[0];

  if (!colony) {
    return null;
  }

  const isInvalidTransaction =
    !isValidTx ||
    !events.length ||
    !action ||
    !txColony ||
    txColony.name !== colonyName;

  if (loading || loadingColony) {
    return <LoadingTemplate loadingText={MSG.loading} />;
  }

  if (isInvalidTransaction) {
    return (
      <Layout center>
        <TransactionNotFound
          colonyName={colony.name}
          transactionHash={transactionHash}
          createdAt={createdAt}
          // status={status}
          isUnknownTx={!events?.length && isValidTx}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <DefaultAction item={action} />
    </Layout>
  );
};

ActionDetailsPage.displayName = displayName;

export default ActionDetailsPage;
