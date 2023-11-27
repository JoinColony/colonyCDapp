import React, { FC } from 'react';

import BalanceTable from './partials/BalanceTable';
import { useBalancePage } from './hooks';

const displayName = 'v5.pages.BalancePage';

const BalancePage: FC = () => {
  const { data } = useBalancePage();

  return (
    <div className="w-full">
      <BalanceTable data={data} />
    </div>
  );
};

BalancePage.displayName = displayName;

export default BalancePage;
