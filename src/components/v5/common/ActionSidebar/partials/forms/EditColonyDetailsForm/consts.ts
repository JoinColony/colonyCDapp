import { type DeepPartial } from 'utility-types';
import { object, string, array } from 'yup';

import {
  MAX_ANNOTATION_LENGTH,
  MAX_COLONY_DISPLAY_NAME,
  MAX_COLONY_DESCRIPTION_LENGTH,
} from '~constants/index.ts';
import { ExternalLinks } from '~gql';
import { formatText } from '~utils/intl.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

import { type EditColonyDetailsFormValues } from './types.ts';

export const getEditColonyDetailsValidationSchema = (
  defaultValues: DeepPartial<EditColonyDetailsFormValues>,
) =>
  object()
    .shape({
      avatar: object().nullable().shape({
        image: string().nullable().defined(),
        thumbnail: string().nullable().defined(),
      }),
      colonyName: string()
        .trim()
        .required(formatText({ id: 'errors.colonyName.required' }))
        .max(
          MAX_COLONY_DISPLAY_NAME,
          formatText(
            { id: 'errors.colonyName.maxLength' },
            {
              maxLength: MAX_COLONY_DISPLAY_NAME,
            },
          ),
        ),
      createdIn: string().defined(),
      decisionMethod: string().required(
        formatText({ id: 'errors.decisionMethod.required' }),
      ),
      description: string().max(MAX_ANNOTATION_LENGTH).notRequired(),
      colonyDescription: string()
        .required(formatText({ id: 'errors.colonyDescription.required' }))
        .max(
          MAX_COLONY_DESCRIPTION_LENGTH,
          formatText(
            { id: 'errors.colonyDescription.maxLength' },
            {
              maxLength: MAX_COLONY_DESCRIPTION_LENGTH,
            },
          ),
        ),
      externalLinks: array()
        .of(
          object()
            .shape({
              name: string().defined().oneOf(Object.values(ExternalLinks)),
              link: string().url().required(),
            })
            .defined(),
        )
        .required(),
    })
    .hasValuesChanged(
      formatText({ id: 'actionSidebar.editColonyDetails.error' }),
      defaultValues,
    )
    .defined()
    .concat(ACTION_BASE_VALIDATION_SCHEMA);
