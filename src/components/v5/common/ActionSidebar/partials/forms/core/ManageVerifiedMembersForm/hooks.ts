import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { defineMessages } from 'react-intl';
import { type DeepPartial } from 'utility-types';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { DecisionMethod } from '~gql';
import { ActionTypes } from '~redux';
import { ManageVerifiedMembersOperation } from '~types';
import { mapPayload } from '~utils/actions.ts';
import { formatText } from '~utils/intl.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import {
  type ManageVerifiedMembersFormValues,
  getValidationSchema,
  getManageVerifiedMembersPayload,
} from './utils.ts';

const MSG = defineMessages({
  memberAlreadyVerified: {
    id: 'v5.common.ActionSidebar.partials.ManageVerifiedMembersForm.errors.members.verified',
    defaultMessage: 'Member is already verified',
  },
  memberAlreadyNotVerified: {
    id: 'v5.common.ActionSidebar.partials.ManageVerifiedMembersForm.errors.members.unverified',
    defaultMessage: 'Member is not verified',
  },
});

export const useManageVerifiedMembers = (
  getFormOptions: CreateActionFormProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { totalMembers, verifiedMembers } = useMemberContext();

  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });
  const manageMembers: ManageVerifiedMembersOperation | undefined = useWatch({
    name: 'manageMembers',
  });
  const actionType = ActionTypes.ACTION_MANAGE_VERIFIED_MEMBERS;
  const motionType = ActionTypes.MOTION_MANAGE_VERIFIED_MEMBERS;

  const validationSchema = useMemo(() => {
    if (manageMembers === ManageVerifiedMembersOperation.Add) {
      const verifiedBlacklist = verifiedMembers.map(
        (member) => member.contributorAddress,
      );
      return getValidationSchema(
        verifiedBlacklist,
        formatText(MSG.memberAlreadyVerified),
      );
    }

    const unverifiedBlacklist = totalMembers
      .filter((member) => !member.isVerified)
      .map((member) => member.contributorAddress);

    return getValidationSchema(
      unverifiedBlacklist,
      formatText(MSG.memberAlreadyNotVerified),
    );
  }, [manageMembers, totalMembers, verifiedMembers]);

  useActionFormBaseHook({
    actionType:
      decisionMethod === DecisionMethod.Permissions ? actionType : motionType,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      mapPayload((values: ManageVerifiedMembersFormValues) =>
        getManageVerifiedMembersPayload(colony, values),
      ),
      [],
    ),
    defaultValues: useMemo<DeepPartial<ManageVerifiedMembersFormValues>>(
      () => ({
        createdIn: Id.RootDomain,
        members: [{}],
      }),
      [],
    ),
    validationSchema,
  });
};
