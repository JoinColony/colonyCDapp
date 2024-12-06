import React, { type FC } from 'react';

import { type ColonyAction } from '~types/graphql.ts';

interface ArbitraryTransactionProps {
  action: ColonyAction;
}

const ArbitraryTransaction: FC<ArbitraryTransactionProps> = ({ action }) => {
  // eslint-disable-next-line no-console
  console.log('action:', action);
  return <div>in progress</div>;
};

export default ArbitraryTransaction;
