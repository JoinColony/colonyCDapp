import { weiToEth } from '@web3-onboard/common';
import React from 'react';
import { useParams } from 'react-router-dom';

import { useGetStreamingPaymentQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { Heading3 } from '~shared/Heading';
import { getExpenditureDatabaseId } from '~utils/databaseId';
import { findDomainByNativeId } from '~utils/domains';

import StreamingPaymentPayouts from './StreamingPaymentPayouts';

import styles from './StreamingPaymentDetailsPage.module.css';

const StreamingPaymentDetailsPage = () => {
  const { streamingPaymentId } = useParams();

  const { colony } = useColonyContext();
  const { colonyAddress = '' } = colony || {};

  const { data, loading } = useGetStreamingPaymentQuery({
    variables: {
      streamingPaymentId: getExpenditureDatabaseId(
        colonyAddress,
        Number(streamingPaymentId),
      ),
    },
    skip: !streamingPaymentId,
  });
  const streamingPayment = data?.getStreamingPayment;

  if (!colony) {
    return null;
  }

  if (loading) {
    return <div>Loading expenditure...</div>;
  }

  if (!streamingPayment) {
    return (
      <div>
        This streaming payment does not exist in the database but a page refresh
        might help.
      </div>
    );
  }

  const streamingPaymentDomain = findDomainByNativeId(
    streamingPayment.nativeDomainId,
    colony,
  );

  return (
    <div>
      <Heading3>Streaming payment {streamingPayment.id}</Heading3>

      <div className={styles.details}>
        <div>Recipient address: {streamingPayment.recipientAddress}</div>
        <div>
          Created in: {streamingPaymentDomain?.metadata?.name ?? 'Unknown team'}
        </div>
        <div>
          End condition: {streamingPayment.metadata?.endCondition ?? 'Unknown'}
        </div>
        {streamingPayment.metadata?.limitAmount && (
          <div>
            Limit amount: {weiToEth(streamingPayment.metadata?.limitAmount)}
          </div>
        )}
        <div>
          Start time:{' '}
          {new Date(streamingPayment.startTime * 1000).toISOString()}
        </div>
        <div>
          End time: {new Date(streamingPayment.endTime * 1000).toISOString()}
        </div>
        <div>Interval: {streamingPayment.interval}s</div>
      </div>

      <StreamingPaymentPayouts streamingPayment={streamingPayment} />
    </div>
  );
};

export default StreamingPaymentDetailsPage;
