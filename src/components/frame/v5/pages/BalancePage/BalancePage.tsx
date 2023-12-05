import React, { FC } from 'react';

import { useSetPageHeadingTitle } from '~context';
import { formatText } from '~utils/intl';

import BalanceTable from './partials/BalanceTable';
import { useBalancePage } from './hooks';

const displayName = 'v5.pages.BalancePage';

const BalancePage: FC = () => {
  const { data } = useBalancePage();

  useSetPageHeadingTitle(formatText({ id: 'balance' }));

  return (
    <div className="w-full">
      <BalanceTable data={data} />
    </div>
  );
};

BalancePage.displayName = displayName;

export default BalancePage;
