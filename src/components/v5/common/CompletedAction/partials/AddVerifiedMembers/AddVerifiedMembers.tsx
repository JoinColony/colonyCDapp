import React from 'react';

import { ColonyActionType, type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
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
  action: ColonyAction;
}

const AddVerifiedMembers = ({ action }: AddVerifiedMembersProps) => {
  const numberOfMembers = action.members?.length || 0;
  const {
    customTitle = formatText(
      {
        id: 'action.type',
      },
      {
        actionType: ColonyActionType.AddVerifiedMembers,
      },
    ),
  } = action?.metadata || {};
  const { initiatorUser } = action;

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        {formatText(
          {
            id: 'action.title',
          },
          {
            actionType: ColonyActionType.AddVerifiedMembers,
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
        <DecisionMethodRow isMotion={action.isMotion || false} />

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

AddVerifiedMembers.displayName = displayName;
export default AddVerifiedMembers;
