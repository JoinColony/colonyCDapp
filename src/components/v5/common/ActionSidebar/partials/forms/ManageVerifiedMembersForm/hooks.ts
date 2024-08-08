import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { defineMessages } from 'react-intl';
import { type DeepPartial } from 'utility-types';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { ActionTypes } from '~redux';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload } from '~utils/actions.ts';
import { formatText } from '~utils/intl.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { ManageMembersType } from './consts.ts';
import {
  type ManageVerifiedMembersFormValues,
  getValidationSchema,
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
  const {
    colony: { colonyAddress, name },
  } = useColonyContext();
  const { totalMembers, verifiedMembers } = useMemberContext();

  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });
  const manageMembers: ManageMembersType | undefined = useWatch({
    name: 'manageMembers',
  });
  const actionType =
    manageMembers === ManageMembersType.Add
      ? ActionTypes.ACTION_ADD_VERIFIED_MEMBERS
      : ActionTypes.ACTION_REMOVE_VERIFIED_MEMBERS;
  const motionType =
    manageMembers === ManageMembersType.Add
      ? ActionTypes.MOTION_ADD_VERIFIED_MEMBERS
      : ActionTypes.MOTION_REMOVE_VERIFIED_MEMBERS;

  const validationSchema = useMemo(() => {
    if (manageMembers === ManageMembersType.Add) {
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
      mapPayload((values: ManageVerifiedMembersFormValues) => {
        const members = values.members?.map((member) => member?.value);

        return {
          colonyAddress,
          colonyName: name,
          members,
          customActionTitle: values.title,
          annotationMessage: values.description,
          domainId: values.createdIn || Id.RootDomain,
        };
      }),
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
