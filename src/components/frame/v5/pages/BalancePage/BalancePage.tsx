import React, { FC } from 'react';

import { useSetPageHeadingTitle } from '~context';
import { formatText } from '~utils/intl';

import BalanceTable from './partials/BalanceTable';

const displayName = 'v5.pages.BalancePage';

const BalancePage: FC = () => {
  useSetPageHeadingTitle(formatText({ id: 'navigation.finances.balance' }));

  return (
    <div className="w-full">
      <BalanceTable />
    </div>
  );
};

BalancePage.displayName = displayName;

export default BalancePage;
