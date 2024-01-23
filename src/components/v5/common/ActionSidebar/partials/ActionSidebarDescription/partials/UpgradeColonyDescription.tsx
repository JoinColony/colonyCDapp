import React from 'react';

import { ColonyActionType } from '~gql';
import useColonyContext from '~hooks/useColonyContext';
import { formatText } from '~utils/intl';

import CurrentUser from './CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.UpgradeColonyDescription';

export const UpgradeColonyDescription = () => {
  const {
    colony: { version },
  } = useColonyContext();

  return (
    <>
      {formatText(
        { id: 'action.title' },
        {
          actionType: ColonyActionType.VersionUpgrade,
          version,
          newVersion: version + 1,
          initiator: <CurrentUser />,
        },
      )}
    </>
  );
};

UpgradeColonyDescription.displayName = displayName;
export default UpgradeColonyDescription;
