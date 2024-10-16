import moveDecimal from 'move-decimal-point';
import { array, object, string } from 'yup';

import { DecisionMethod } from '~gql';
import { type Colony } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import {
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import { hasEnoughFundsValidation } from '~utils/validation/hasEnoughFundsValidation.ts';
import { type SelectBaseOption } from '~v5/common/Fields/Select/types.ts';

export const fundingDecisionMethodItems: SelectBaseOption[] = [
  {
    label: formatText({ id: 'decisionMethodSelect.decision.permissions' }),
    value: DecisionMethod.Permissions,
  },
];

export const fundingDecisionMethodDescriptions = {
  [DecisionMethod.Permissions]: formatText({
    id: 'fundingModal.permissionsDescription',
  }),
};

export const getValidationSchema = (
  selectedTeam: number | undefined,
  colony: Colony,
) =>
  object()
    .shape({
      decisionMethod: object().shape({
        value: string().required(),
      }),
      fundingItems: array()
        .of(
          object()
            .shape({
              amount: string()
                .required(formatText({ id: 'errors.amount' }))
                .test(
                  'enough-tokens',
                  formatText({ id: 'errors.amount.notEnoughTokens' }) || '',
                  (value, context) => {
                    const { parent } = context;
                    const { tokenAddress } = parent || {};
                    const tokenData = getSelectedToken(colony, tokenAddress);

                    return hasEnoughFundsValidation({
                      value: moveDecimal(
                        value,
                        -getTokenDecimalsWithFallback(tokenData?.decimals),
                      ),
                      domainId: selectedTeam,
                      context,
                      colony,
                    });
                  },
                ),
              tokenAddress: string().required(),
            })
            .defined()
            .required(),
        )
        .defined()
        .required(),
    })
    .defined();
