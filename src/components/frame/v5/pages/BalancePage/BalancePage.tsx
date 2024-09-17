import React, { type FC } from 'react';

import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { formatText } from '~utils/intl.ts';
import TeamFilter from '~v5/shared/TeamFilter/TeamFilter.tsx';

import { FiltersContextProvider } from './partials/BalanceTable/Filters/FiltersContext/index.ts';
import BalanceTable from './partials/BalanceTable/index.ts';

const displayName = 'v5.pages.BalancePage';

const BalancePage: FC = () => {
  useSetPageHeadingTitle(formatText({ id: 'navigation.finances.balance' }));

  return (
    <div className="flex w-full flex-col gap-8">
      <TeamFilter />
      <FiltersContextProvider>
        <BalanceTable />
      </FiltersContextProvider>
    </div>
  );
};

BalancePage.displayName = displayName;

export default BalancePage;
