import { array, type InferType, object, string } from 'yup';

import { formatText } from '~utils/intl.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

export const validationSchema = object()
  .shape({
    title: string()
      .trim()
      .required(() => 'Please enter a title.'),
    decisionMethod: string().required(
      formatText({ id: 'errors.decisionMethod.required' }),
    ),
    transactions: array()
      .of(
        object()
          .shape({
            contractAddress: string().defined(),
            jsonAbi: string().defined(),
            method: string().defined(),
            args: array().of(
              object().shape({
                value: string().required(
                  formatText({ id: 'validation.required' }),
                ),
                name: string().required(
                  formatText({ id: 'validation.required' }),
                ),
              }),
            ),
          })
          .defined(),
      )
      .required(formatText({ id: 'errors.transactions.required' })),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type CreateArbitraryTxsFormValues = InferType<typeof validationSchema>;
