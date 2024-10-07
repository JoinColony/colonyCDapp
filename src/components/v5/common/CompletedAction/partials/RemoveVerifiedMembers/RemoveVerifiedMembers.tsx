import React from 'react';

import { Action } from '~constants/actions.ts';
import { ManageVerifiedMembersOperation } from '~types';
import { ColonyActionType, type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import {
  TITLE_FIELD_NAME,
  ACTION_TYPE_FIELD_NAME,
  MEMBERS_FIELD_NAME,
  MANAGE_MEMBERS_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { useDecisionMethod } from '~v5/common/CompletedAction/hooks.ts';
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

const displayName = 'v5.common.CompletedAction.partials.RemoveVerifiedMembers';

interface RemoveVerifiedMembersProps {
  action: ColonyAction;
}

const RemoveVerifiedMembers = ({ action }: RemoveVerifiedMembersProps) => {
  const decisionMethod = useDecisionMethod(action);
  const numberOfMembers = action.members?.length || 0;
  const {
    customTitle = formatText(
      {
        id: 'action.type',
      },
      {
        actionType: ColonyActionType.RemoveVerifiedMembers,
      },
    ),
  } = action?.metadata || {};
  const { initiatorUser, transactionHash, annotation } = action;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu
          showRedoItem={false}
          transactionHash={transactionHash}
          defaultValues={{
            [TITLE_FIELD_NAME]: customTitle,
            [ACTION_TYPE_FIELD_NAME]: Action.ManageVerifiedMembers,
            [MEMBERS_FIELD_NAME]: [],
            [MANAGE_MEMBERS_FIELD_NAME]: ManageVerifiedMembersOperation.Remove,
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
            actionType: ColonyActionType.RemoveVerifiedMembers,
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
        <ActionTypeRow actionType={action.type} />
        <AddRemoveRow actionType={action.type} />
        <DecisionMethodRow action={action} />

        {action.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={action.motionData.motionDomain.metadata}
          />
        )}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}
      {action.members !== undefined && action.members !== null && (
        <SelectedMembers memberAddresses={action.members} />
      )}
    </>
  );
};

RemoveVerifiedMembers.displayName = displayName;
export default RemoveVerifiedMembers;
