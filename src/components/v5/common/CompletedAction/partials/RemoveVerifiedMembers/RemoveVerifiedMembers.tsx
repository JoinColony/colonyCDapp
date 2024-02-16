import { FilePlus } from 'phosphor-react';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { ColonyActionType, type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import { DEFAULT_TOOLTIP_POSITION, ICON_SIZE } from '../../consts.ts';
import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import AddRemoveRow from '../rows/AddRemove.tsx';
import {
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
              <UserPopover
                userName={initiatorUser.profile?.displayName}
                walletAddress={initiatorUser.walletAddress}
                user={initiatorUser}
                withVerifiedBadge={false}
              >
                {initiatorUser.profile?.displayName}
              </UserPopover>
            ) : null,
          },
        )}
      </ActionSubtitle>
      <ActionDataGrid>
        {/* @NOTE UI doesn't separate add and remove members, so we just smash in Manage here */}
        <div>
          <Tooltip
            placement={DEFAULT_TOOLTIP_POSITION}
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.actionType',
            })}
          >
            <div className="flex items-center gap-2">
              <FilePlus size={ICON_SIZE} />
              <span>{formatText({ id: 'actionSidebar.actionType' })}</span>
            </div>
          </Tooltip>
        </div>
        <div>
          {formatText({
            id: 'actions.manageVerifiedMembers',
          })}
        </div>

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

RemoveVerifiedMembers.displayName = displayName;
export default RemoveVerifiedMembers;
