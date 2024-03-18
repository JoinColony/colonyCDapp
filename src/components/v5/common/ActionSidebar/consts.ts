import { type Variants } from 'framer-motion';
import { object, string } from 'yup';

// Do not import these from `./hooks` to avoid circular dependencies

import { MAX_ANNOTATION_LENGTH } from '~constants/index.ts';
import { stripHTMLFromText } from '~utils/elements.ts';
import { formatText } from '~utils/intl.ts';

import { reputationValidationSchema } from './hooks/useReputationValidation.ts';

export const ACTION_TYPE_FIELD_NAME = 'actionType';
export const DECISION_METHOD_FIELD_NAME = 'decisionMethod';
export const TITLE_FIELD_NAME = 'title';
export const DESCRIPTION_FIELD_NAME = 'description';
export const CREATED_IN_FIELD_NAME = 'createdIn';

export const actionSidebarAnimation: Variants = {
  hidden: {
    x: '100%',
  },
  visible: {
    x: 0,
  },
};

function isValidDescriptionLength(description: string) {
  const strippedDescription = stripHTMLFromText(description);
  return strippedDescription.length <= MAX_ANNOTATION_LENGTH;
}

export const ACTION_BASE_VALIDATION_SCHEMA = object()
  .shape({
    title: string()
      .required(formatText({ id: 'errors.title.required' }))
      .max(60, ({ max }) =>
        formatText(
          { id: 'errors.title.maxLength' },
          {
            maxLength: max,
          },
        ),
      ),
    description: string()
      .test(
        'isValidDescriptionLength',
        formatText(
          { id: 'errors.description.maxLength' },
          { maxLength: MAX_ANNOTATION_LENGTH },
        ),
        isValidDescriptionLength,
      )
      .notRequired(),
  })
  .defined()
  .concat(reputationValidationSchema);
