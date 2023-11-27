import { array, InferType, number, object, string } from 'yup';
import { MAX_ANNOTATION_NUM } from '~v5/shared/RichText/consts';
import { toFinite } from '~utils/lodash';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = object({
  amount: object({
    amount: number()
      .required(() => 'required field')
      .transform((value) => toFinite(value))
      .moreThan(0, () => 'Amount must be greater than zero.'),
    tokenAddress: string().address().required(),
  }).required(),
  createdIn: string().defined(),
  description: string().max(MAX_ANNOTATION_NUM).notRequired(),
  team: string().required(),
  decisionMethod: string().defined(),
  distributionMethod: string().defined(),
  payments: array(
    object().shape({
      percent: number().required(),
      recipient: string().required(),
    }),
  )
    .test('sum', 'The sum of percentages must be 100.', (value) => {
      if (!value) {
        return false;
      }

      const sum = value.reduce((acc, curr) => acc + (curr?.percent || 0), 0);

      return sum === 100;
    })
    .required(),
})
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type SplitPaymentFormValues = InferType<typeof validationSchema>;
