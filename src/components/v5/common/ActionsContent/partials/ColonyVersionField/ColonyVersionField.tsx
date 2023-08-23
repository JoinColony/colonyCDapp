import React, { FC } from 'react';
import { useColonyContext } from '~hooks';

import ActionSidebarRow from '~v5/common/ActionSidebarRow/ActionSidebarRow';

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
      <ActionSidebarRow
        iconName="browser"
        title={{ id: 'actionSidebar.currentVersion' }}
      >
        <span className="text-md">{currentVersion}</span>
      </ActionSidebarRow>
      <ActionSidebarRow
        iconName="browsers"
        title={{ id: 'actionSidebar.newVersion' }}
      >
        <span className="text-md">{nextVersion}</span>
      </ActionSidebarRow>
    </>
  );
};

ColonyVersionField.displayName = displayName;

export default ColonyVersionField;
