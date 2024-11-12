import { array, type InferType, object, string } from 'yup';

import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

export const validationSchema = object()
  .shape({
    title: string()
      .trim()
      .required(() => 'Please enter a title.'),
    decisionMethod: string().defined(),
    transactions: array()
      .of(
        object()
          .shape({
            contractAddress: string().defined(),
            jsonAbi: string().defined(),
          })
          .defined(),
      )
      .required(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type CreateArbitraryTxsFormValues = InferType<typeof validationSchema>;
