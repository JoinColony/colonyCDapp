import React from 'react';

import { PencilCircle } from 'phosphor-react';
import { ColonyAction } from '~types';

import CreatedInRow from '../rows/CreatedInRow';
import DecisionMethodRow from '../rows/DecisionMethod';
import ActionTypeRow from '../rows/ActionType';
import DescriptionRow from '../rows/Description';
import { ActionDataGrid, ActionSubtitle, ActionTitle } from '../Blocks/Blocks';
import Tooltip from '~shared/Extensions/Tooltip';
import { formatText } from '~utils/intl';
import { ICON_SIZE } from '../../consts';

const displayName = 'v5.common.CompletedAction.partials.EditColonyDetails';

interface EditColonyDetailsProps {
  action: ColonyAction;
}

const EditColonyDetails = ({ action }: EditColonyDetailsProps) => {
  const { customTitle = 'Create decision' } = action?.metadata || {};

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        Edit details of the Colony by{' '}
        {action.initiatorUser?.profile?.displayName}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />

        <div>
          <Tooltip
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.editColony.colonyName',
            })}
          >
            <div className="flex items-center gap-2">
              <PencilCircle size={ICON_SIZE} />
              <span>{formatText({ id: 'actionSidebar.colonyName' })}</span>
            </div>
          </Tooltip>
        </div>
        <div>
          <span>{action.colony.metadata?.displayName}</span>
        </div>

        <DecisionMethodRow isMotion={action.isMotion || false} />

        {action.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={action.motionData.motionDomain.metadata}
          />
        )}

        {action.annotation?.message && (
          <DescriptionRow description={action.annotation.message} />
        )}

        {/* @TODO implement social links table display */}
      </ActionDataGrid>
    </>
  );
};

EditColonyDetails.displayName = displayName;
export default EditColonyDetails;
