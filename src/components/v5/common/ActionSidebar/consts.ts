import { type Variants } from 'framer-motion';
import { object, string } from 'yup';

// Do not import these from `./hooks` to avoid circular dependencies

import { MAX_ANNOTATION_LENGTH } from '~constants/index.ts';
import { stripHTMLFromText } from '~utils/elements.ts';
import { formatText } from '~utils/intl.ts';

import { reputationValidationSchema } from './hooks/useReputationValidation.ts';

export { REPUTATION_VALIDATION_FIELD_NAME } from './hooks/useReputationValidation.ts';

export const ACTION_TYPE_FIELD_NAME = 'actionType';
export const DECISION_METHOD_FIELD_NAME = 'decisionMethod';
export const TITLE_FIELD_NAME = 'title';
export const FROM_FIELD_NAME = 'from';
export const TO_FIELD_NAME = 'to';
export const RECIPIENT_FIELD_NAME = 'recipient';
export const AMOUNT_FIELD_NAME = 'amount';
export const TOKEN_FIELD_NAME = 'tokenAddress';
export const DESCRIPTION_FIELD_NAME = 'description';
export const CREATED_IN_FIELD_NAME = 'createdIn';
export const MANAGE_SUPPORTED_CHAINS_FIELD_NAME = 'manageSupportedChains';
export const CHAIN_FIELD_NAME = 'chain';
export const MODIFICATION_FIELD_NAME = 'modification';
export const TEAM_FIELD_NAME = 'team';
export const MEMBER_FIELD_NAME = 'member';
export const MEMBERS_FIELD_NAME = 'members';
export const MANAGE_MEMBERS_FIELD_NAME = 'manageMembers';
export const COLONY_NAME_FIELD_NAME = 'colonyName';
export const COLONY_AVATAR_FIELD_NAME = 'avatar';
export const COLONY_DESCRIPTION_FIELD_NAME = 'colonyDescription';
export const ARBITRARY_TRANSACTIONS_FIELD_NAME = 'transactions';
export const COLONY_OBJECTIVE_TITLE_FIELD_NAME = 'colonyObjectiveTitle';
export const COLONY_OBJECTIVE_DESCRIPTION_FIELD_NAME =
  'colonyObjectiveDescription';

export const NON_RESETTABLE_FIELDS = [TITLE_FIELD_NAME, ACTION_TYPE_FIELD_NAME];

export enum ManageEntityOperation {
  Add = 'Add',
  Remove = 'Remove',
}

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
