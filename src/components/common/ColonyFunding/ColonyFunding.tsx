import React from 'react';

import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import FundsTable from '~frame/v5/pages/FundsPage/partials/FundsTable/index.ts';
import { formatText } from '~utils/intl.ts';
import TeamFilter from '~v5/shared/TeamFilter/TeamFilter.tsx';

const displayName = 'common.ColonyFunding';

const ColonyFunding = () => {
  useSetPageHeadingTitle(formatText({ id: 'incomingFundsPage.title' }));

  return (
    <div className="flex flex-col gap-8">
      <TeamFilter />
      <FundsTable />
    </div>
  );
};

ColonyFunding.displayName = displayName;

export default ColonyFunding;
