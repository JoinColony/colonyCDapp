import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ColonyActionType } from '~gql';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.ArbitraryTxsDescription';

export const ArbitraryTxsDescription = () => {
  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ColonyActionType.ArbitraryTxs,
        initiator: <CurrentUser />,
      }}
    />
  );
};

ArbitraryTxsDescription.displayName = displayName;
export default ArbitraryTxsDescription;
