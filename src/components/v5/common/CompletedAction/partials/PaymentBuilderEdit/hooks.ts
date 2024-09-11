import { unformatNumeral } from 'cleave-zen';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { useMemo } from 'react';
import { array, object, string } from 'yup';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useTokenLockStates from '~hooks/useTokenLockStates.ts';
import { notNull } from '~utils/arrays/index.ts';
import getLastIndexFromPath from '~utils/getLastIndexFromPath.ts';
import { formatText } from '~utils/intl.ts';
import { shouldPreventPaymentsWithTokenInColony } from '~utils/tokens.ts';
import { amountGreaterThanZeroValidation } from '~utils/validation/amountGreaterThanZeroValidation.ts';
import { CLAIM_DELAY_MAX_VALUE } from '~v5/common/ActionSidebar/partials/forms/PaymentBuilderForm/partials/ClaimDelayField/consts.ts';
import { allTokensAmountValidation } from '~v5/common/ActionSidebar/partials/forms/PaymentBuilderForm/utils.ts';

export const useValidationSchema = (networkInverseFee: string | undefined) => {
  const { colony } = useColonyContext();
  const colonyTokens = useMemo(
    () =>
      colony.tokens?.items
        .filter(notNull)
        .map((colonyToken) => colonyToken.token) || [],
    [colony.tokens?.items],
  );
  const tokenLockStatesMap = useTokenLockStates();

  return useMemo(
    () =>
      object()
        .shape({
          payments: array()
            .of(
              object()
                .shape({
                  recipient: string()
                    .required(({ path }) => {
                      const index = getLastIndexFromPath(path);
                      if (index === undefined) {
                        return formatText({ id: 'errors.recipient.required' });
                      }
                      return formatText(
                        { id: 'errors.recipient.requiredIn' },
                        { paymentIndex: index + 1 },
                      );
                    })
                    .address(),
                  amount: string()
                    .required(formatText({ id: 'errors.amount' }))
                    .test(
                      'more-than-zero',
                      ({ path }) => {
                        const index = getLastIndexFromPath(path);
                        if (index === undefined) {
                          return formatText({
                            id: 'errors.amount.greaterThanZero',
                          });
                        }
                        return formatText(
                          { id: 'errors.amount.greaterThanZeroIn' },
                          { paymentIndex: index + 1 },
                        );
                      },
                      (value, context) =>
                        amountGreaterThanZeroValidation({
                          value,
                          context,
                          colony,
                        }),
                    )
                    .test('tokens-sum-exceeded', '', (value, context) =>
                      allTokensAmountValidation({
                        value,
                        context,
                        colony,
                        networkInverseFee,
                      }),
                    ),
                  tokenAddress: string()
                    .required()
                    .test(
                      'token-unlocked',
                      formatText({ id: 'errors.amount.tokenIsLocked' }) || '',
                      (value) =>
                        !shouldPreventPaymentsWithTokenInColony(
                          value || '',
                          colony,
                          tokenLockStatesMap,
                        ),
                    ),
                  delay: string()
                    .test(
                      'is-bigger-than-max',
                      ({ path }) => {
                        const index = getLastIndexFromPath(path);

                        return formatText(
                          { id: 'errors.delay.max' },
                          {
                            paymentIndex: index === undefined ? 1 : index + 1,
                            max: CLAIM_DELAY_MAX_VALUE,
                          },
                        );
                      },
                      (value) => {
                        if (!value) {
                          return true;
                        }

                        const unformattedValue = unformatNumeral(value);

                        return BigNumber.from(
                          moveDecimal(unformattedValue, 4),
                        ).lte(moveDecimal(CLAIM_DELAY_MAX_VALUE, 4));
                      },
                    )
                    .required(({ path }) => {
                      const index = getLastIndexFromPath(path);
                      if (index === undefined) {
                        return formatText({ id: 'errors.delay.empty' });
                      }
                      return formatText(
                        { id: 'errors.delay.emptyIndex' },
                        { paymentIndex: index + 1 },
                      );
                    }),
                })
                .defined()
                .required(),
            )
            .defined()
            .required(),
        })
        .test(
          'is-in-colony',
          formatText({ id: 'actionSidebar.tokenAddress.error' }),
          (item) => {
            const { payments } = item || {};

            if (!payments) {
              return false;
            }

            return payments.every((payment) => {
              return colonyTokens.some(
                (colonyToken) =>
                  colonyToken.tokenAddress === payment.tokenAddress,
              );
            });
          },
        )
        .defined(),
    [colony, colonyTokens, networkInverseFee, tokenLockStatesMap],
  );
};
