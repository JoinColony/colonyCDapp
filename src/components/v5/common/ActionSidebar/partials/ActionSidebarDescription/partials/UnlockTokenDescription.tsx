import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ColonyActionType } from '~gql';

import CurrentUser from './CurrentUser';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.UnlockTokenDescription';

export const UnlockTokenDescription = () => {
  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ColonyActionType.UnlockToken,
        tokenSymbol: '', // apparently the designs don't use it
        initiator: <CurrentUser />,
      }}
    />
  );
};

UnlockTokenDescription.displayName = displayName;
export default UnlockTokenDescription;
