import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { ActionDetailsPageParams } from '~common/ColonyActions/ActionDetailsPage';
import { failedLoadingDuration as pollingTimeout } from '~frame/LoadingTemplate';
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

  useEffect(() => {
    const cancelPollingTimer = setTimeout(stopPollingForAction, pollingTimeout);
    return () => clearTimeout(cancelPollingTimer);
  }, [stopPollingForAction]);

  const { state: locationState } = useLocation();
  /* Don't poll if we've not been redirected from the saga */
  const isRedirect = locationState?.isRedirect;
  const action = actionData?.getColonyAction;
  const shouldStopPolling = (!isRedirect && isPolling) || (action && isPolling);

  if (shouldStopPolling) {
    stopPollingForAction();
    setIsPolling(false);
  }

  return {
    isInvalidTransactionHash: !isValidTx,
    isUnknownTransaction:
      isValidTx && action?.colony?.colonyAddress !== colony?.colonyAddress,
    loadingAction: loadingAction || isPolling,
    action,
  };
};

export default useGetColonyAction;
