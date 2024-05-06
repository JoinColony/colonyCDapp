import { Rocket } from '@phosphor-icons/react';
import React from 'react';

import { formatText } from '~utils/intl.ts';

import ActionData from './ActionData.tsx';

const displayName = 'v5.common.CompletedAction.partials.TeamPurpose';

interface TeamPurposeProps {
  description: string;
}

const TeamPurpose = ({ description }: TeamPurposeProps) => (
  <div className="col-span-2 grid grid-cols-subgrid py-[.3125rem]">
    <ActionData
      rowLabel={formatText({ id: 'actionSidebar.teamPurpose' })}
      rowContent={<span className="break-word">{description}</span>}
      tooltipContent={formatText({
        id: 'actionSidebar.tooltip.createNewTeam.team.purpose',
      })}
      RowIcon={Rocket}
    />
  </div>
);

TeamPurpose.displayName = displayName;
export default TeamPurpose;
