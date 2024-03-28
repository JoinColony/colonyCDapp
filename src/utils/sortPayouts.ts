import { BigNumber } from 'ethers';

import { type ExpenditurePayout } from '~types/graphql.ts';

export const sortPayouts = (payouts: ExpenditurePayout[]) =>
  payouts?.sort((a, b) => {
    if (!a.amount || !b.amount || BigNumber.from(a.amount).eq(b.amount))
      return 0;

    return BigNumber.from(a.amount).gt(b.amount) ? -1 : 1;
  });
