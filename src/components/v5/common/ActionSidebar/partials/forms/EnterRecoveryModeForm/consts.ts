import { type InferType, object, string, number } from 'yup';

import { formatText } from '~utils/intl.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

export const validationSchema = object()
  .shape({
    createdIn: number().defined(),
    decisionMethod: string().required(
      formatText({ id: 'errors.decisionMethod.required' }),
    ),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type EnterRecoveryModeFormValues = InferType<typeof validationSchema>;
