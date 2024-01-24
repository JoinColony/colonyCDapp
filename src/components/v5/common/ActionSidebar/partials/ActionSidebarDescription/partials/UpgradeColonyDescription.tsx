import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ColonyActionType } from '~gql';
import useColonyContext from '~hooks/useColonyContext';

import CurrentUser from './CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.UpgradeColonyDescription';

export const UpgradeColonyDescription = () => {
  const {
    colony: { version },
  } = useColonyContext();

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ColonyActionType.VersionUpgrade,
        version,
        newVersion: version + 1,
        initiator: <CurrentUser />,
      }}
    />
  );
};

UpgradeColonyDescription.displayName = displayName;
export default UpgradeColonyDescription;
