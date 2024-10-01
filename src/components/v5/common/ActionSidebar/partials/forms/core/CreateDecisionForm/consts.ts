import { type InferType, object, string, number } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants/index.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

export const validationSchema = object()
  .shape({
    title: string()
      .trim()
      .required(() => 'Please enter a title.'),
    createdIn: number().defined(),
    description: string()
      .test(
        'descriptionLength',
        `Description must be at most ${MAX_ANNOTATION_LENGTH} characters`,
        (value) => {
          if (!value) return true;
          // This is added to remove HTML tags from the text to count the length
          return value.replace(/<[^>]*>/g, '').length <= MAX_ANNOTATION_LENGTH;
        },
      )
      .required(),
    decisionMethod: string().defined(),
    walletAddress: string().address().required(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type CreateDecisionFormValues = InferType<typeof validationSchema>;
