import React, { type FC } from 'react';

import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { formatText } from '~utils/intl.ts';
import ContentWithTeamFilter from '~v5/frame/ContentWithTeamFilter/ContentWithTeamFilter.tsx';

import { FiltersContextProvider } from './partials/BalanceTable/Filters/FiltersContext/index.ts';
import BalanceTable from './partials/BalanceTable/index.ts';

const displayName = 'v5.pages.BalancePage';

const BalancePage: FC = () => {
  useSetPageHeadingTitle(formatText({ id: 'navigation.finances.balance' }));

  return (
    <ContentWithTeamFilter>
      <FiltersContextProvider>
        <BalanceTable />
      </FiltersContextProvider>
    </ContentWithTeamFilter>
  );
};

BalancePage.displayName = displayName;

export default BalancePage;
