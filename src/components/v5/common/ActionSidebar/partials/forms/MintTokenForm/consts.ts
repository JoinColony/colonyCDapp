import * as yup from 'yup';
import { toFinite } from '~utils/lodash';
import { MAX_ANNOTATION_LENGTH } from '~constants';

export const validationSchema = yup
  .object()
  .shape({
    amount: yup
      .object()
      .shape({
        amount: yup
          .number()
          .required(() => 'required field')
          .transform((value) => toFinite(value))
          .moreThan(0, () => 'Amount must be greater than zero'),
        tokenAddress: yup.string().address().required(),
      })
      .required(),
    createdIn: yup.string().defined(),
    decisionMethod: yup.string().defined(),
    description: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
  })
  .defined();

export type MintTokenFormValues = yup.InferType<typeof validationSchema>;
