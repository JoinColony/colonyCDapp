import { ClientType } from '@colony/colony-js';

import { TransactionGroupStates } from '~context/UserTransactionContext/UserTransactionContext.ts';
import { TransactionStatus } from '~gql';

const userTransactions = {
  transactionAndMessageGroups: [
    [
      {
        context: ClientType.OneTxPaymentClient,
        createdAt: new Date('2024-02-22T19:07:37.629Z'),
        from: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
        group: {
          key: 'paymentAction',
          id: 'ryzfwf8vt7s',
          index: 0,
        },
        id: 'ryzfwf8vt7s-paymentAction',
        identifier: '0xa6Ee101fe6D2C220e373B2D1DE70A905Aa03bf41',
        methodName: 'makePaymentFundedFromDomain',
        options: {},
        params: [],
        status: TransactionStatus.Pending,
        loadingRelated: false,
        metatransaction: false,
      },
      {
        context: ClientType.ColonyClient,
        createdAt: new Date('2024-02-22T19:07:37.632Z'),
        from: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
        group: {
          key: 'paymentAction',
          id: 'ryzfwf8vt7s',
          index: 1,
        },
        id: 'ryzfwf8vt7s-annotatePaymentAction',
        identifier: '0xa6Ee101fe6D2C220e373B2D1DE70A905Aa03bf41',
        methodName: 'annotateTransaction',
        options: {},
        params: [],
        status: TransactionStatus.Created,
        loadingRelated: false,
        metatransaction: false,
      },
    ],
  ],
  canLoadMoreTransactions: false,
  groupState: TransactionGroupStates.SomePending,
  fetchMoreTransactions: () => {},
};

export default userTransactions;
