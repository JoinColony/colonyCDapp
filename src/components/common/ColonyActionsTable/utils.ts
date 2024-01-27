import { ADDRESS_ZERO, DEFAULT_TOKEN_DECIMALS } from '~constants/index.ts';
import { ColonyActionType } from '~gql';
import { ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';

export const makeLoadingRows = (pageSize: number): ActivityFeedColonyAction[] =>
  Array.from(
    {
      length: pageSize,
    },
    (_, index) => ({
      blockNumber: index,
      colony: {
        colonyAddress: ADDRESS_ZERO,
        nativeToken: {
          tokenAddress: ADDRESS_ZERO,
          nativeTokenDecimals: DEFAULT_TOKEN_DECIMALS,
          nativeTokenSymbol: 'TKN',
        },
      },
      colonyAddress: ADDRESS_ZERO,
      createdAt: new Date().toISOString(),
      initiatorAddress: ADDRESS_ZERO,
      initiatorUser: {
        walletAddress: ADDRESS_ZERO,
      },
      showInActionsList: true,
      transactionHash: ADDRESS_ZERO + index,
      type: ColonyActionType.Payment,
    }),
  );
