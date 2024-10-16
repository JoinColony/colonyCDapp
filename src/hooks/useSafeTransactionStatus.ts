import { defineMessages } from 'react-intl';

import { type ActionData } from '~actions';
import { ETHEREUM_NETWORK } from '~constants/index.ts';
import { useGetSafeTransactionStatusQuery } from '~gql';

export enum TRANSACTION_STATUS {
  COMPLETED = 'Completed',
  ACTION_NEEDED = 'Action needed',
}

const displayName = 'utils.safe';

export const MSG = defineMessages({
  [TRANSACTION_STATUS.COMPLETED]: {
    id: `${displayName}.${[TRANSACTION_STATUS.COMPLETED]}`,
    defaultMessage: TRANSACTION_STATUS.COMPLETED,
  },
  [TRANSACTION_STATUS.ACTION_NEEDED]: {
    id: `${displayName}.${[TRANSACTION_STATUS.ACTION_NEEDED]}`,
    defaultMessage: TRANSACTION_STATUS.ACTION_NEEDED,
  },
});

const getSafeTransactionMessageHash = (actionData: ActionData | undefined) => {
  if (actionData?.safeTransaction) {
    if (actionData?.motionData) {
      return (
        actionData?.motionData.messages?.items
          .find((message) => message?.name === 'MotionFinalized')
          ?.messageKey.substring(0, 66) || ''
      );
    }
    return actionData?.transactionHash;
  }
  return '';
};

const useSafeTransactionStatus = (actionData: ActionData | undefined) => {
  const safeChainId =
    actionData?.safeTransaction?.safe.chainId || ETHEREUM_NETWORK.chainId;
  const transactionHash = getSafeTransactionMessageHash(actionData);
  const { data } = useGetSafeTransactionStatusQuery({
    variables: {
      input: { transactionHash, chainId: safeChainId },
    },
  });
  const transactionStatus = data?.getSafeTransactionStatus || [];

  return transactionStatus;
};

export default useSafeTransactionStatus;
