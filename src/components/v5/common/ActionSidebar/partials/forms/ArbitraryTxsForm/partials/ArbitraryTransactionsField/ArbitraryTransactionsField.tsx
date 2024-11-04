import React from 'react';

import { formatText } from '~utils/intl.ts';

import ArbitraryTransactionsTable from '../ArbitraryTransactionsTable/ArbitraryTransactionsTable.tsx';

const displayName =
  'v5.common.ActionSidebar.partials.ArbitraryTxsForm.partials.ArbitraryTransactionsField';

const ArbitraryTransactionsField = () => {
  return (
    <div>
      <h5 className="mb-3 mt-6 text-2">
        {formatText({ id: 'actionSidebar.transactions' })}
      </h5>
      <ArbitraryTransactionsTable name="transactions" />
    </div>
  );
};

ArbitraryTransactionsField.displayName = displayName;

export default ArbitraryTransactionsField;
