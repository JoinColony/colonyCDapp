import * as yup from 'yup';
import {
  MAX_ANNOTATION_LENGTH,
  MAX_COLONY_DISPLAY_NAME,
  MAX_DOMAIN_PURPOSE_LENGTH,
} from '~constants';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = yup
  .object()
  .shape({
    team: yup.string().defined(),
    teamName: yup
      .string()
      .trim()
      .max(MAX_COLONY_DISPLAY_NAME)
      .required(() => 'Team name required'),
    domainPurpose: yup
      .string()
      .trim()
      .max(MAX_DOMAIN_PURPOSE_LENGTH)
      .notRequired(),
    domainColor: yup.string().notRequired(),
    createdIn: yup.string().defined(),
    decisionMethod: yup.string().defined(),
    description: yup.string().max(MAX_ANNOTATION_LENGTH).notRequired(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type EditTeamFormValues = yup.InferType<typeof validationSchema>;
