import React from 'react';

import { ColonyActionType } from '~gql';
import { formatText } from '~utils/intl';

import CurrentUser from './CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.UnlockTokenDescription';

export const UnlockTokenDescription = () => {
  return (
    <>
      {formatText(
        { id: 'action.title' },
        {
          actionType: ColonyActionType.UnlockToken,
          tokenSymbol: '', // apparently the designs don't use it
          initiator: <CurrentUser />,
        },
      )}
    </>
  );
};

UnlockTokenDescription.displayName = displayName;
export default UnlockTokenDescription;
