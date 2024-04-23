import { type InferType, number, object, string } from 'yup';

import {
  MAX_OBJECTIVE_DESCRIPTION_LENGTH,
  MAX_OBJECTIVE_TITLE,
} from '~constants/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

export const validationSchema = object()
  .shape({
    colonyObjectiveTitle: string()
      .trim()
      .max(
        MAX_OBJECTIVE_TITLE,
        formatText(
          { id: 'errors.colonyObjective.max.title' },
          { characters: MAX_OBJECTIVE_TITLE },
        ),
      )
      .required(() => formatText({ id: 'errors.colonyObjective.title' })),
    colonyObjectiveDescription: string()
      .trim()
      .max(
        MAX_OBJECTIVE_DESCRIPTION_LENGTH,
        formatText(
          { id: 'errors.colonyObjective.max.description' },
          { characters: MAX_OBJECTIVE_DESCRIPTION_LENGTH },
        ),
      )
      .required(() => formatText({ id: 'errors.colonyObjective.description' })),
    colonyObjectiveProgress: number()
      .max(100, formatText({ id: 'errors.colonyObjective.max.progress' }))
      .required(() => formatText({ id: 'errors.colonyObjective.progress' })),
    createdIn: number().defined(),
    decisionMethod: string().required(() =>
      formatText({ id: 'errors.decisionMethod.required' }),
    ),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type ManageColonyObjectivesFormValues = InferType<
  typeof validationSchema
>;
