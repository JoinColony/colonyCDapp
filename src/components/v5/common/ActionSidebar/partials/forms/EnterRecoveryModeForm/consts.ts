import { InferType, object, string, number } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = object()
  .shape({
    createdIn: number().defined(),
    decisionMethod: string().defined(),
    description: string().max(MAX_ANNOTATION_LENGTH).notRequired(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type EnterRecoveryModeFormValues = InferType<typeof validationSchema>;
