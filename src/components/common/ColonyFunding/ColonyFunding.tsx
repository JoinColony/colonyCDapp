import React from 'react';

import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import FundsTable from '~frame/v5/pages/FundsPage/partials/FundsTable/index.ts';
import { formatText } from '~utils/intl.ts';
import ContentWithTeamFilter from '~v5/frame/ContentWithTeamFilter/ContentWithTeamFilter.tsx';

const displayName = 'common.ColonyFunding';

const ColonyFunding = () => {
  useSetPageHeadingTitle(formatText({ id: 'incomingFundsPage.title' }));

  return (
    <ContentWithTeamFilter>
      <FundsTable />
    </ContentWithTeamFilter>
  );
};

ColonyFunding.displayName = displayName;

export default ColonyFunding;
