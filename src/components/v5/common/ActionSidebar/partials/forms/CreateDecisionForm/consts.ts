import { InferType, object, string, number } from 'yup';

import { MAX_OBJECTIVE_DESCRIPTION_LENGTH } from '~constants';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = object()
  .shape({
    title: string()
      .trim()
      .required(() => 'Please enter a title.'),
    createdIn: number().defined(),
    description: string().max(MAX_OBJECTIVE_DESCRIPTION_LENGTH).notRequired(),
    decisionMethod: string().defined(),
    walletAddress: string().address().required(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type CreateDecisionFormValues = InferType<typeof validationSchema>;
