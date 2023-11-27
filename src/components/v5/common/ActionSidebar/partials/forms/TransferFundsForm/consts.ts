import { InferType, number, object, string } from 'yup';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { toFinite } from '~utils/lodash';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = object()
  .shape({
    amount: object()
      .shape({
        amount: number()
          .required(() => 'required field')
          .transform((value) => toFinite(value))
          .moreThan(0, () => 'Amount must be greater than zero.'),
        tokenAddress: string().address().required(),
      })
      .required(),
    createdIn: string().defined(),
    from: string().required(),
    to: string()
      .required()
      .when('from', (from, schema) =>
        schema.notOneOf([from], 'Cannot move to same team pot.'),
      ),
    decisionMethod: string().defined(),
    description: string().max(MAX_ANNOTATION_LENGTH).defined(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type TransferFundsFormValues = InferType<typeof validationSchema>;
