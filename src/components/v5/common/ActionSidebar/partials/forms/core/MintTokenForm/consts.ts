import { type InferType, number, object, string } from 'yup';

import { toFinite } from '~utils/lodash.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

export const validationSchema = object()
  .shape({
    amount: number()
      .required(() => 'required field')
      .transform((value) => toFinite(value))
      .moreThan(0, () => 'Amount must be greater than zero.'),
    tokenAddress: string().address().required(),
    decisionMethod: string().defined(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type MintTokenFormValues = InferType<typeof validationSchema>;
