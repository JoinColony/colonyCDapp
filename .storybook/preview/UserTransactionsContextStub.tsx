import React, { type FC, type PropsWithChildren } from 'react';

import { UserTransactionContext } from '~context/UserTransactionContext/UserTransactionContext.ts';

import data from '../data/userTransactionsContext.ts';

const UserTransactionContextStub: FC<PropsWithChildren> = ({ children }) => {
  return (
    <UserTransactionContext.Provider value={data}>
      {children}
    </UserTransactionContext.Provider>
  );
};

export default UserTransactionContextStub;
