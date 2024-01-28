import { defineMessages } from 'react-intl';

import { ETHEREUM_NETWORK } from '~constants/index.ts';
import { useGetSafeTransactionStatusQuery } from '~gql';
import { type ColonyAction } from '~types/graphql.ts';

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

const getSafeTransactionMessageHash = (action: ColonyAction | undefined) => {
  if (action?.safeTransaction) {
    if (action?.motionData) {
      return (
        action?.motionData.messages?.items
          .find((message) => message?.name === 'MotionFinalized')
          ?.messageKey.substring(0, 66) || ''
      );
    }
    return action?.transactionHash;
  }
  return '';
};

const useSafeTransactionStatus = (action: ColonyAction | undefined) => {
  const safeChainId =
    action?.safeTransaction?.safe.chainId || ETHEREUM_NETWORK.chainId;
  const transactionHash = getSafeTransactionMessageHash(action);
  const { data } = useGetSafeTransactionStatusQuery({
    variables: {
      input: { transactionHash, chainId: safeChainId },
    },
  });
  const transactionStatus = data?.getSafeTransactionStatus || [];

  return transactionStatus;
};

export default useSafeTransactionStatus;
