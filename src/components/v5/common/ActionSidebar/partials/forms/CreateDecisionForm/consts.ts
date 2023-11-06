import * as yup from 'yup';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = yup
  .object()
  .shape({
    title: yup
      .string()
      .trim()
      .required(() => 'Please enter a title.'),
    createdIn: yup.string().defined(),
    description: yup
      .string()
      .notOneOf(['<p></p>'], () => 'Please enter a description.')
      .defined(),
    decisionMethod: yup.string().defined(),
    walletAddress: yup.string().address().required(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type CreateDecisionFormValues = yup.InferType<typeof validationSchema>;
