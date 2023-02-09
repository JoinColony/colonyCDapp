import React from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import { isTransactionFormat } from '~utils/web3';
import { useColonyContext } from '~hooks';
import LoadingTemplate from '~frame/LoadingTemplate';
import { useGetFullColonyByAddressQuery } from '~gql';

import { mockActionData } from '../mockData';
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

type ActionDetailsPageParams = Record<'colonyName' | 'transactionHash', string>;

const ActionDetailsPage = () => {
  const { colony } = useColonyContext();
  const { transactionHash, colonyName } = useParams<ActionDetailsPageParams>();

  const action = mockActionData.find(
    (item) => item.transactionHash === transactionHash,
  );

  const createdAt = action?.createdAt;
  // const status = action?.transactionStatus;

  const isValidTx = isTransactionFormat(transactionHash);
  const events = ['event']; // to be taken from real data

  // Todo: get colony address from the event and compare with colony in the pathname
  // to ensure this tx was generated in this colony
  const { data, loading: loadingColony } = useGetFullColonyByAddressQuery({
    variables: {
      address: action?.colonyAddress,
    },
  });

  const txColony = data?.getColonyByAddress?.items[0];

  if (!colony) {
    return null;
  }

  const isInvalidTransaction =
    !isValidTx ||
    !events?.length ||
    !action ||
    !txColony ||
    txColony.name !== colonyName;

  if (loadingColony) {
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

  const isMotion = action.isMotion;

  if (isMotion) {
    return (
      <Layout isMotion>
        <DefaultMotion item={action} />
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
