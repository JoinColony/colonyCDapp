import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { ActionDetailsPageParams } from '~common/ColonyActions/ActionDetailsPage/ActionDetailsPage';
import { useGetColonyActionQuery } from '~gql';
import { Colony } from '~types';
import { isTransactionFormat } from '~utils/web3';

const useGetColonyAction = (colony?: Colony | null) => {
  const { transactionHash } = useParams<ActionDetailsPageParams>();
  const isValidTx = isTransactionFormat(transactionHash);
  const skipQuery = !colony || !isValidTx;
  /* Unfortunately, we need to track polling state ourselves: https://github.com/apollographql/apollo-client/issues/9081#issuecomment-975722271 */
  const [isPolling, setIsPolling] = useState(!skipQuery);

  const {
    data: actionData,
    loading: loadingAction,
    stopPolling: stopPollingForAction,
  } = useGetColonyActionQuery({
    skip: skipQuery,
    variables: {
      transactionHash: transactionHash ?? '',
    },
    pollInterval: 1000,
  });

  const action = actionData?.getColonyAction;

  if (action && isPolling) {
    stopPollingForAction();
    setIsPolling(false);
  }

  return {
    isInvalidTransactionHash: !isValidTx,
    isUnknownTransaction: action?.colony?.colonyName !== colony?.name,
    loadingAction: loadingAction || isPolling,
    action,
  };
};

export default useGetColonyAction;
