import React, { type FC } from 'react';

import { useSetPageHeadingTitle } from '~context/PageHeadingContext/index.ts';
import { formatText } from '~utils/intl.ts';

import BalanceTable from './partials/BalanceTable/index.ts';

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
