import { PaintBucket, UserList } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { useTeams } from '~frame/v5/pages/TeamsPage/hooks.tsx';
import { ColonyActionType, type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import TeamColorBadge from '~v5/common/TeamColorBadge.tsx';
import UserInfoPopover from '~v5/shared/UserInfoPopover/index.ts';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import {
  ActionData,
  ActionTypeRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
  TeamPurpose,
} from '../rows/index.ts';

const displayName = 'v5.common.CompletedAction.partials.ManageTeam';

interface CreateNewTeamProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  newTeamTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Create a new team',
  },
  editTeamTitle: {
    id: `${displayName}.editTitle`,
    defaultMessage: 'Edit a team',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage:
      '{isAddingNewTeam, select, true {Create new team {team} by {user}} other {Change {team} team details by {user}}}',
  },
});

const ManageTeam = ({ action }: CreateNewTeamProps) => {
  const isAddingNewTeam = action.type.includes(ColonyActionType.CreateDomain);

  const {
    customTitle = formatText(
      isAddingNewTeam ? MSG.newTeamTitle : MSG.editTeamTitle,
    ),
  } = action?.metadata || {};
  const { initiatorUser } = action;

  const actionDomainMetadata =
    action.pendingDomainMetadata || action.fromDomain?.metadata;

  const metadata =
    action.motionData?.motionDomain.metadata ??
    action.multiSigData?.multiSigDomain.metadata;

  const { searchedTeams } = useTeams();

  const team = searchedTeams.find(
    (searchedTeam) => searchedTeam.key === action.fromDomain?.id,
  )?.title;

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
          team,
          user: initiatorUser ? (
            <UserInfoPopover
              walletAddress={initiatorUser.walletAddress}
              user={initiatorUser}
              withVerifiedBadge={false}
            >
              {initiatorUser.profile?.displayName}
            </UserInfoPopover>
          ) : null,
          isAddingNewTeam,
        })}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.teamName' })}
          rowContent={actionDomainMetadata?.name}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.createNewTeam.team.name',
          })}
          RowIcon={UserList}
        />
        {actionDomainMetadata?.description && (
          <TeamPurpose description={actionDomainMetadata.description} />
        )}
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.teamColour' })}
          rowContent={
            <TeamColorBadge
              defaultColor={actionDomainMetadata?.color}
              title={actionDomainMetadata?.name || 'Team'}
            />
          }
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.createNewTeam.team.colour',
          })}
          RowIcon={PaintBucket}
        />
        <DecisionMethodRow
          isMotion={action.isMotion || false}
          isMultisig={action.isMultiSig || false}
        />

        {metadata && <CreatedInRow motionDomainMetadata={metadata} />}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}
    </>
  );
};

ManageTeam.displayName = displayName;
export default ManageTeam;
