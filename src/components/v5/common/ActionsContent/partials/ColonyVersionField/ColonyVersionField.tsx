import React, { FC } from 'react';
import { useColonyContext } from '~hooks';

import ActionSidebarRow from '~v5/common/ActionSidebarRow/ActionSidebarRow';
import { ActionSidebarRowFieldNameEnum } from '~v5/common/ActionSidebarRow/enums';

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
        fieldName={ActionSidebarRowFieldNameEnum.CURRENT_VERSION}
        title={{ id: 'actionSidebar.currentVersion' }}
      >
        <span className="text-md">{currentVersion}</span>
      </ActionSidebarRow>
      <ActionSidebarRow
        iconName="browsers"
        fieldName={ActionSidebarRowFieldNameEnum.NEW_VERSION}
        title={{ id: 'actionSidebar.newVersion' }}
      >
        <span className="text-md">{nextVersion}</span>
      </ActionSidebarRow>
    </>
  );
};

ColonyVersionField.displayName = displayName;

export default ColonyVersionField;
