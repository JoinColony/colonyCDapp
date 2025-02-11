import { UsersThree } from '@phosphor-icons/react';
import React from 'react';

import { ColonyActionType, type DomainMetadata } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import TeamBadge from '~v5/common/Pills/TeamBadge/index.ts';

import ActionData from './ActionData.tsx';

const displayName = 'v5.common.CompletedAction.partials.TeamFromRow';

interface TeamFromRowProps {
  teamMetadata: DomainMetadata;
  actionType: ColonyActionType;
}

const TeamFromRow = ({ teamMetadata, actionType }: TeamFromRowProps) => {
  const getTooltipContent = () => {
    switch (actionType) {
      case ColonyActionType.SetUserRoles:
      case ColonyActionType.SetUserRolesMultisig:
      case ColonyActionType.EmitDomainReputationPenalty:
      case ColonyActionType.EmitDomainReputationReward:
        return formatText({
          id: 'actionSidebar.tooltip.managePermissions.team',
        });
      case ColonyActionType.CreateStreamingPayment:
        return formatText({
          id: 'actionSidebar.tooltip.streamingPayment.from',
        });
      default:
        return formatText({
          id: 'actionSidebar.tooltip.simplePayment.from',
        });
    }
  };
  const getRowTitle = () => {
    switch (actionType) {
      case ColonyActionType.SetUserRoles:
      case ColonyActionType.SetUserRolesMultisig:
      case ColonyActionType.EmitDomainReputationPenalty:
      case ColonyActionType.EmitDomainReputationReward:
        return formatText({ id: 'actionSidebar.team' });
      case ColonyActionType.CreateExpenditure:
        return formatText({ id: 'actionSidebar.fundFrom' });
      case ColonyActionType.CreateStreamingPayment:
        return formatText({ id: 'actionSidebar.streamFrom' });
      default:
        return formatText({ id: 'actionSidebar.from' });
    }
  };

  return (
    <ActionData
      rowLabel={getRowTitle()}
      tooltipContent={getTooltipContent()}
      RowIcon={UsersThree}
      rowContent={
        <TeamBadge name={teamMetadata.name} color={teamMetadata.color} />
      }
    />
  );
};

TeamFromRow.displayName = displayName;
export default TeamFromRow;
