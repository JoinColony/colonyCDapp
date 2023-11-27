import { InferType, object, string } from 'yup';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = object()
  .shape({
    title: string()
      .trim()
      .required(() => 'Please enter a title.'),
    createdIn: string().defined(),
    description: string()
      .notOneOf(['<p></p>'], () => 'Please enter a description.')
      .defined(),
    decisionMethod: string().defined(),
    walletAddress: string().address().required(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type CreateDecisionFormValues = InferType<typeof validationSchema>;
