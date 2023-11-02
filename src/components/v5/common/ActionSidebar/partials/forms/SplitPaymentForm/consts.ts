import * as yup from 'yup';
import { MAX_ANNOTATION_NUM } from '~v5/shared/RichText/consts';
import { toFinite } from '~utils/lodash';

export const validationSchema = yup
  .object({
    amount: yup
      .object({
        amount: yup
          .number()
          .required(() => 'required field')
          .transform((value) => toFinite(value))
          .moreThan(0, () => 'Amount must be greater than zero.'),
        tokenAddress: yup.string().address().required(),
      })
      .required(),
    createdIn: yup.string().defined(),
    description: yup.string().max(MAX_ANNOTATION_NUM).notRequired(),
    team: yup.string().required(),
    decisionMethod: yup.string().defined(),
    distributionMethod: yup.string().defined(),
    payments: yup
      .array(
        yup.object().shape({
          percent: yup.number().required(),
          recipient: yup.string().required(),
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
  .defined();

export type SplitPaymentFormValues = yup.InferType<typeof validationSchema>;
