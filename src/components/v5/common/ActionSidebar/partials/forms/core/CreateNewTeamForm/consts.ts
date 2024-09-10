import { type InferType, object, string, number } from 'yup';

import {
  MAX_COLONY_DISPLAY_NAME,
  MAX_DOMAIN_PURPOSE_LENGTH,
} from '~constants/index.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

export const validationSchema = object()
  .shape({
    teamName: string()
      .trim()
      .max(MAX_COLONY_DISPLAY_NAME)
      .required(() => 'Team name required.'),
    domainPurpose: string().trim().max(MAX_DOMAIN_PURPOSE_LENGTH).notRequired(),
    domainColor: string().defined(),
    createdIn: number().defined(),
    decisionMethod: string().defined(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type CreateNewTeamFormValues = InferType<typeof validationSchema>;
