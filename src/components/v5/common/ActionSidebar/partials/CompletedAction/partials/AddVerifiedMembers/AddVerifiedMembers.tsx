import React from 'react';

import {
  type ActionData,
  CoreAction,
  CoreActionGroup,
} from '~actions/index.ts';
import { ManageVerifiedMembersOperation } from '~types';
import { formatText } from '~utils/intl.ts';
import {
  TITLE_FIELD_NAME,
  ACTION_TYPE_FIELD_NAME,
  MEMBERS_FIELD_NAME,
  MANAGE_MEMBERS_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { useDecisionMethod } from '~v5/common/ActionSidebar/partials/CompletedAction/hooks.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import MeatballMenu from '../MeatballMenu/MeatballMenu.tsx';
import AddRemoveRow from '../rows/AddRemove.tsx';
import {
  ActionTypeRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
} from '../rows/index.ts';
import SelectedMembers from '../SelectedMembers/SelectedMembers.tsx';

const displayName = 'v5.common.CompletedAction.partials.AddVerifiedMembers';

interface AddVerifiedMembersProps {
  actionData: ActionData;
}

const AddVerifiedMembers = ({ actionData }: AddVerifiedMembersProps) => {
  const decisionMethod = useDecisionMethod(actionData);
  const numberOfMembers = actionData.members?.length || 0;
  const {
    customTitle = formatText(
      {
        id: 'action.type',
      },
      {
        actionType: CoreAction.AddVerifiedMembers,
      },
    ),
  } = actionData?.metadata || {};
  const { initiatorUser, transactionHash, annotation } = actionData;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu
          showRedoItem={false}
          transactionHash={transactionHash}
          defaultValues={{
            [TITLE_FIELD_NAME]: customTitle,
            [ACTION_TYPE_FIELD_NAME]: CoreActionGroup.ManageVerifiedMembers,
            [MEMBERS_FIELD_NAME]: [],
            [MANAGE_MEMBERS_FIELD_NAME]: ManageVerifiedMembersOperation.Add,
            [DECISION_METHOD_FIELD_NAME]: decisionMethod,
            [DESCRIPTION_FIELD_NAME]: annotation?.message,
          }}
        />
      </div>
      <ActionSubtitle>
        {formatText(
          {
            id: 'action.title',
          },
          {
            actionType: CoreAction.AddVerifiedMembers,
            members: numberOfMembers,
            initiator: initiatorUser ? (
              <UserInfoPopover
                walletAddress={initiatorUser.walletAddress}
                user={initiatorUser}
                withVerifiedBadge={false}
              >
                {initiatorUser.profile?.displayName}
              </UserInfoPopover>
            ) : null,
          },
        )}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={actionData.type} />
        <AddRemoveRow actionType={actionData.type} />
        <DecisionMethodRow
          isMotion={actionData.isMotion || false}
          isMultisig={actionData.isMultiSig || false}
        />

        {actionData.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={actionData.motionData.motionDomain.metadata}
          />
        )}
      </ActionDataGrid>
      {actionData.annotation?.message && (
        <DescriptionRow description={actionData.annotation.message} />
      )}
      {actionData.members !== undefined && actionData.members !== null && (
        <SelectedMembers memberAddresses={actionData.members} />
      )}
    </>
  );
};

AddVerifiedMembers.displayName = displayName;
export default AddVerifiedMembers;
