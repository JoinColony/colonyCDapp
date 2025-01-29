import { type InferType, object, string, number } from 'yup';

import {
  MAX_COLONY_DISPLAY_NAME,
  MAX_DOMAIN_PURPOSE_LENGTH,
} from '~constants/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

export const validationSchema = object()
  .shape({
    teamName: string()
      .trim()
      .max(MAX_COLONY_DISPLAY_NAME)
      .required(formatText({ id: 'errors.teamName.required' })),
    domainPurpose: string().trim().max(MAX_DOMAIN_PURPOSE_LENGTH).notRequired(),
    domainColor: string().required(
      formatText({ id: 'errors.domainColor.required' }),
    ),
    createdIn: number().defined(),
    decisionMethod: string().required(
      formatText({ id: 'errors.decisionMethod.required' }),
    ),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type CreateNewTeamFormValues = InferType<typeof validationSchema>;
