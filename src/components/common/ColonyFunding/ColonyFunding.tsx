import React from 'react';
import { useSetPageBreadcrumbs, useSetPageHeadingTitle } from '~context';
import FundsTable from '~frame/v5/pages/FundsPage/partials/FundsTable';
import { useCreateTeamBreadcrumbs } from '~hooks/useTeamsBreadcrumbs';
import { formatText } from '~utils/intl';

const displayName = 'common.ColonyFunding';

const ColonyFunding = () => {
  useSetPageHeadingTitle(formatText({ id: 'incomingFundsPage.title' }));
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();
  useSetPageBreadcrumbs(teamsBreadcrumbs);

  return <FundsTable />;
};

ColonyFunding.displayName = displayName;

export default ColonyFunding;
