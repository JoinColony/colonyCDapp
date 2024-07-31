import { BigNumber } from 'ethers';

import { type ExpenditurePayoutWithSlotId } from '~types/expenditures.ts';
import { type ExpenditurePayout } from '~types/graphql.ts';
import { sortPayouts } from '~utils/sortPayouts.ts';

export const getSummedTokens = (
  data: ExpenditurePayoutWithSlotId[],
  isPaid?: boolean,
) =>
  sortPayouts(
    data.reduce<ExpenditurePayout[]>((result, item) => {
      const { amount, tokenAddress, isClaimed } = item;

      if (!amount) {
        return result;
      }

      const existingEntryIndex = result.findIndex(
        (entry) => entry.tokenAddress === tokenAddress,
      );

      if (existingEntryIndex < 0) {
        return [
          ...result,
          {
            tokenAddress,
            isClaimed: false,
            amount: isPaid && !isClaimed ? '0' : amount,
          },
        ];
      }

      if (isPaid) {
        return [
          ...result.slice(0, existingEntryIndex),
          {
            ...result[existingEntryIndex],
            amount: BigNumber.from(result[existingEntryIndex].amount)
              .add(BigNumber.from(isClaimed ? amount : '0'))
              .toString(),
          },
          ...result.slice(existingEntryIndex + 1),
        ];
      }

      return [
        ...result.slice(0, existingEntryIndex),
        {
          ...result[existingEntryIndex],
          amount: BigNumber.from(result[existingEntryIndex].amount)
            .add(BigNumber.from(amount || '0'))
            .toString(),
        },
        ...result.slice(existingEntryIndex + 1),
      ];
    }, []),
  );
