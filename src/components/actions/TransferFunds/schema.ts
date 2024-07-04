import { type InferType, number, object, string } from 'yup';

import { formatText } from '~utils/intl.ts';
import { amountGreaterThanZeroValidation } from '~utils/validation/amountGreaterThanZeroValidation.ts';
import { hasEnoughFundsValidation } from '~utils/validation/hasEnoughFundsValidation.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

export const schema = ({ colony }) =>
  object()
    .shape({
      amount: string()
        .required(() => formatText({ id: 'errors.amount' }))
        .test(
          'more-than-zero',
          formatText({
            id: 'errors.amount.greaterThanZero',
          }),
          (value, context) =>
            amountGreaterThanZeroValidation({ value, context, colony }),
        )
        .test(
          'enough-tokens',
          formatText({ id: 'errors.amount.notEnoughTokens' }) || '',
          (value, context) =>
            // FIXME: domainId is not in scope here, we need to figure out a way how to deal with this
            hasEnoughFundsValidation({ value, domainId: 0, context, colony }),
        ),
      tokenAddress: string().address().required(),
      createdIn: number().defined(),
      from: number().required(),
      to: number()
        .required()
        .when('from', (from, self) =>
          self.notOneOf(
            [from],
            formatText({ id: 'errors.cantMoveToTheSameTeam' }),
          ),
        ),
      decisionMethod: string().defined(),
    })
    .defined()
    .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type FormValues = InferType<typeof schema>;
