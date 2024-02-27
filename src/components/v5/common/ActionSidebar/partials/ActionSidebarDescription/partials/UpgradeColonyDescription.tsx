import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { ColonyActionType } from '~gql';
import useColonyContractVersion from '~hooks/useColonyContractVersion.ts';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.UpgradeColonyDescription';

export const UpgradeColonyDescription = () => {
  const {
    colony: { version },
  } = useColonyContext();
  const { colonyContractVersion: newVersion } = useColonyContractVersion();

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ColonyActionType.VersionUpgrade,
        version,
        newVersion,
        initiator: <CurrentUser />,
      }}
    />
  );
};

UpgradeColonyDescription.displayName = displayName;
export default UpgradeColonyDescription;
