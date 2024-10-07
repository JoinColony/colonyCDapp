import { HouseLine } from '@phosphor-icons/react';
import React from 'react';

import { type DomainMetadata } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import TeamBadge from '~v5/common/Pills/TeamBadge/index.ts';

import ActionContent from './ActionContent.tsx';

const displayName = 'v5.common.CompletedAction.partials.CreatedInRow';

interface CreatedInRowProps {
  motionDomainMetadata: DomainMetadata;
}

const CreatedInRow = ({ motionDomainMetadata }: CreatedInRowProps) => {
  return (
    <ActionContent
      rowLabel={formatText({ id: 'actionSidebar.createdIn' })}
      tooltipContent={formatText({
        id: 'actionSidebar.tooltip.createdIn',
      })}
      RowIcon={HouseLine}
      rowContent={
        <TeamBadge
          name={motionDomainMetadata.name}
          color={motionDomainMetadata.color}
        />
      }
    />
  );
};

CreatedInRow.displayName = displayName;
export default CreatedInRow;
