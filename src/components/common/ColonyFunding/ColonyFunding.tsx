import React, { useMemo } from 'react';
import { useSetPageBreadcrumbs, useSetPageHeadingTitle } from '~context';
import FundsTable from '~frame/v5/pages/FundsPage/partials/FundsTable';
import { formatText } from '~utils/intl';

const displayName = 'common.ColonyFunding';

const ColonyFunding = () => {
  useSetPageHeadingTitle(formatText({ id: 'incomingFundsPage.title' }));
  useSetPageBreadcrumbs(
    useMemo(
      () => [
        {
          key: 'teams',
          // @todo: replace with actual teams
          dropdownOptions: [
            {
              label: 'All teams',
              href: '/teams',
            },
          ],
          selectedValue: '/teams',
        },
      ],
      [],
    ),
  );

  return <FundsTable />;
};

ColonyFunding.displayName = displayName;

export default ColonyFunding;
