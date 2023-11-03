import React, { FC } from 'react';
import { useColonyContext } from '~hooks';
import { formatText } from '~utils/intl';

import ActionFormRow from '~v5/common/ActionFormRow';

const displayName = 'v5.common.ActionsContent.partials.ColonyVersionField';

const ColonyVersionField: FC = () => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  const currentVersion = colony.version;
  const nextVersion = currentVersion + 1;

  return (
    <>
      <ActionFormRow
        iconName="browser"
        title={formatText({ id: 'actionSidebar.currentVersion' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.upgradeColonyVersion.currentVersion',
            }),
          },
        }}
      >
        <span className="text-md">{currentVersion}</span>
      </ActionFormRow>
      <ActionFormRow
        iconName="browsers"
        title={formatText({ id: 'actionSidebar.newVersion' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.upgradeColonyVersion.newVersion',
            }),
          },
        }}
      >
        <span className="text-md">{nextVersion}</span>
      </ActionFormRow>
    </>
  );
};

ColonyVersionField.displayName = displayName;

export default ColonyVersionField;
