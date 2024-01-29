import { InferType, object, string, number } from 'yup';

import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.tsx';

export const validationSchema = object()
  .shape({
    createdIn: number().defined(),
    decisionMethod: string().defined(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type EnterRecoveryModeFormValues = InferType<typeof validationSchema>;
