import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useColonyContext } from '~hooks';

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
        title={<FormattedMessage id="actionSidebar.currentVersion" />}
      >
        <span className="text-md">{currentVersion}</span>
      </ActionFormRow>
      <ActionFormRow
        iconName="browsers"
        title={<FormattedMessage id="actionSidebar.newVersion" />}
      >
        <span className="text-md">{nextVersion}</span>
      </ActionFormRow>
    </>
  );
};

ColonyVersionField.displayName = displayName;

export default ColonyVersionField;
