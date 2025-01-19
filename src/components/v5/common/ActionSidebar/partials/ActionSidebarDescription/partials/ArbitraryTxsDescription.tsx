import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { ColonyActionType } from '~gql';
import { type CreateArbitraryTxsFormValues } from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/consts.ts';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.ArbitraryTxsDescription';

export const ArbitraryTxsDescription = () => {
  const formValues = useFormContext<CreateArbitraryTxsFormValues>().getValues();

  const { transactions } = formValues;

  const firstArbitraryMethodName =
    transactions?.[0]?.method.replace(/\s*\([^)]*\)/g, '') || '';

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ColonyActionType.MakeArbitraryTransaction,
        initiator: <CurrentUser />,
        arbitraryTransactionsLength: transactions?.length || 0,
        arbitraryMethod: firstArbitraryMethodName,
      }}
    />
  );
};

ArbitraryTxsDescription.displayName = displayName;
export default ArbitraryTxsDescription;
