import { BigNumber } from 'ethers';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetColonyExpendituresQuery } from '~gql';
import { type Address } from '~types';

export const useColonyExpenditureBalances = () => {
  const { colony } = useColonyContext();

  const { data, loading } = useGetColonyExpendituresQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
    },
  });
  const expenditures = data?.getColony?.expenditures?.items ?? [];

  const balancesByToken = expenditures.reduce<Record<Address, string>>(
    (balances, expenditure) => {
      expenditure?.balances?.forEach((balance) => {
        // eslint-disable-next-line no-param-reassign
        balances[balance.tokenAddress] = BigNumber.from(
          balances[balance.tokenAddress] ?? 0,
        )
          .add(balance.amount)
          .toString();
      });

      return balances;
    },
    {},
  );

  return { balancesByToken, loading };
};
