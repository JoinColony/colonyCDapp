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

const displayName = 'v5.common.CompletedAction.partials.RemoveVerifiedMembers';

interface RemoveVerifiedMembersProps {
  action: ColonyAction;
}

const RemoveVerifiedMembers = ({ action }: RemoveVerifiedMembersProps) => {
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
        <DecisionMethodRow
          isMotion={action.isMotion || false}
          isMultisig={action.isMultiSig || false}
        />

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
