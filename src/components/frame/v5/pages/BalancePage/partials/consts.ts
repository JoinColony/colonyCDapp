import * as yup from 'yup';
import { toFinite } from '~utils/lodash';

export const validationSchema = yup
  .object()
  .shape({
    forceAction: yup.boolean().defined(),
    amount: yup
      .number()
      .required()
      .transform((value) => toFinite(value))
      .moreThan(0),
    tokenAddress: yup.string().address().required(),
  })
  .defined();

export type TransferFundsFormValues = yup.InferType<typeof validationSchema>;
