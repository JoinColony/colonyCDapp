import React from 'react';

import { ExtendedColonyActionType } from '~types';
import { formatText } from '~utils/intl';

import CurrentUser from './CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.ManageTokensDescription';

export const ManageTokensDescription = () => {
  return (
    <>
      {formatText(
        { id: 'action.title' },
        {
          actionType: ExtendedColonyActionType.UpdateTokens,
          initiator: <CurrentUser />,
        },
      )}
    </>
  );
};

ManageTokensDescription.displayName = displayName;
export default ManageTokensDescription;
