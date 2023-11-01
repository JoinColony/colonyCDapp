import * as yup from 'yup';

export const validationSchema = yup
  .object()
  .shape({
    title: yup
      .string()
      .trim()
      .required(() => 'Please enter a title'),
    createdIn: yup.string().defined(),
    description: yup
      .string()
      .notOneOf(['<p></p>'], () => 'Please enter a description')
      .defined(),
    decisionMethod: yup.string().defined(),
    walletAddress: yup.string().address().required(),
  })
  .defined();

export type CreateDecisionFormValues = yup.InferType<typeof validationSchema>;
