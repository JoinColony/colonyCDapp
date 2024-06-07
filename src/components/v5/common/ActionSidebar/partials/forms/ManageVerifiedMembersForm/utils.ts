import { defineMessages } from 'react-intl';
import { array, type InferType, number, object, string } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { formatText } from '~utils/intl.ts';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts.ts';

const MSG = defineMessages({
  membersRequired: {
    id: 'v5.common.ActionSidebar.partials.ManageVerifiedMembersForm.errors.member.required',
    defaultMessage: 'Please select a member',
  },
});

export const getValidationSchema = (
  addressBlacklist: string[],
  errorMessage: string,
) =>
  object()
    .shape({
      createdIn: number().defined(),
      decisionMethod: string().defined(),
      description: string().max(MAX_ANNOTATION_LENGTH).notRequired(),
      members: array().of(
        object()
          .shape({
            value: string().required(formatText(MSG.membersRequired)),
          })
          .test('can-manage-member', errorMessage, (value) => {
            // if no value entered, skip this validation and fallback to required validation
            if (!value?.value) {
              return true;
            }

            return !addressBlacklist.includes(value.value);
          }),
      ),
      manageMembers: string().defined(),
    })
    .defined()
    .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type ManageVerifiedMembersFormValues = InferType<
  ReturnType<typeof getValidationSchema>
>;
