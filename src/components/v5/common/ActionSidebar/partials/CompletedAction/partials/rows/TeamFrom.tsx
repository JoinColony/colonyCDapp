import { UsersThree } from '@phosphor-icons/react';
import React from 'react';

import { CoreAction } from '~actions/index.ts';
import { type DomainMetadata } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import TeamBadge from '~v5/common/Pills/TeamBadge/index.ts';

import ActionContent from './ActionContent.tsx';

const displayName = 'v5.common.CompletedAction.partials.TeamFromRow';

interface TeamFromRowProps {
  teamMetadata: DomainMetadata;
  actionType: CoreAction;
}

const TeamFromRow = ({ teamMetadata, actionType }: TeamFromRowProps) => {
  const getTooltipContent = () => {
    switch (actionType) {
      case CoreAction.SetUserRoles:
      case CoreAction.SetUserRolesMultisig:
      case CoreAction.EmitDomainReputationPenalty:
      case CoreAction.EmitDomainReputationReward:
        return formatText({
          id: 'actionSidebar.tooltip.managePermissions.team',
        });
      default:
        return formatText({
          id: 'actionSidebar.tooltip.simplePayment.from',
        });
    }
  };
  const getRowTitle = () => {
    switch (actionType) {
      case CoreAction.SetUserRoles:
      case CoreAction.SetUserRolesMultisig:
      case CoreAction.EmitDomainReputationPenalty:
      case CoreAction.EmitDomainReputationReward:
        return formatText({ id: 'actionSidebar.team' });
      case CoreAction.CreateExpenditure:
        return formatText({ id: 'actionSidebar.fundFrom' });
      default:
        return formatText({ id: 'actionSidebar.from' });
    }
  };

  return (
    <ActionContent
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
