import { useMemo } from 'react';
import { object } from 'yup';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { useGetPaymentsValidationSchema } from '~v5/common/ActionSidebar/partials/forms/PaymentBuilderForm/hooks.ts';

export const useValidationSchema = () => {
  const { colony } = useColonyContext();
  const colonyTokens = useMemo(
    () =>
      colony.tokens?.items
        .filter(notNull)
        .map((colonyToken) => colonyToken.token) || [],
    [colony.tokens?.items],
  );
  const paymentsValidation = useGetPaymentsValidationSchema();

  return useMemo(
    () =>
      object()
        .shape({
          payments: paymentsValidation,
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
    [colonyTokens, paymentsValidation],
  );
};
