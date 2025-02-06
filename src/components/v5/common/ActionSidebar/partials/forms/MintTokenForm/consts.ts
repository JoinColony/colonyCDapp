import { type InferType, number, object, string } from 'yup';

import { formatText } from '~utils/intl.ts';
import { toFinite } from '~utils/lodash.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

export const validationSchema = object()
  .shape({
    amount: number()
      .transform((value) => toFinite(value))
      .required(formatText({ id: 'errors.value.greaterThanZero' }))
      .moreThan(0, () => formatText({ id: 'errors.value.greaterThanZero' })),
    tokenAddress: string().address().required(),
    decisionMethod: string().required(
      formatText({ id: 'errors.decisionMethod.required' }),
    ),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type MintTokenFormValues = InferType<typeof validationSchema>;
