import React from 'react';

import {
  useSetPageBreadcrumbs,
  useSetPageHeadingTitle,
} from '~context/PageHeadingContext/index.ts';
import FundsTable from '~frame/v5/pages/FundsPage/partials/FundsTable/index.ts';
import { useCreateTeamBreadcrumbs } from '~hooks/useTeamsBreadcrumbs.ts';
import { formatText } from '~utils/intl.ts';

const displayName = 'common.ColonyFunding';

const ColonyFunding = () => {
  useSetPageHeadingTitle(formatText({ id: 'incomingFundsPage.title' }));
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();
  useSetPageBreadcrumbs(teamsBreadcrumbs);

  return <FundsTable />;
};

ColonyFunding.displayName = displayName;

export default ColonyFunding;
