import { BigNumber } from 'ethers';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import { groupBy } from '~utils/lodash.ts';
import { calculateFee, getTokenDecimalsWithFallback } from '~utils/tokens.ts';

export const useBuildTokenSumsMap = () => {
  const {
    colony: { tokens },
  } = useColonyContext();

  const { setValue } = useFormContext();

  const { networkInverseFee = '0' } = useNetworkInverseFee();

  const payments = useWatch({ name: 'payments' });
  const stages = useWatch({ name: 'stages' });

  useEffect(() => {
    if (tokens?.items?.length) {
      const groupedTokens = groupBy(
        payments || stages,
        (payment) => payment.tokenAddress,
      );

      const tokenSums = tokens.items.reduce((accumulator, item) => {
        if (!item?.token) return accumulator;

        const { tokenAddress, decimals } = item.token;
        const tokenGroup = groupedTokens[tokenAddress];

        if (tokenGroup) {
          const tokenDecimals = getTokenDecimalsWithFallback(decimals);

          const tokenAmountSum = tokenGroup.reduce((acc, payment) => {
            if (!payment?.amount) return acc;

            const { totalToPay } = calculateFee(
              payment.amount,
              networkInverseFee ?? '0',
              tokenDecimals,
            );

            return acc.add(totalToPay);
          }, BigNumber.from('0'));

          return {
            ...accumulator,
            [tokenAddress]: tokenAmountSum,
          };
        }

        return accumulator;
      }, {});

      setValue('_tokenSums', tokenSums);
    }
  }, [networkInverseFee, payments, setValue, stages, tokens?.items]);
};
