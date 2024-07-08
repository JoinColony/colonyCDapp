import React, { type ReactNode, type FC } from 'react';
import { type FieldValues } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

import { TX_SEARCH_PARAM } from '~routes';

import useGetGroupedActionComponent from './hooks/useGetGroupedActionComponent.tsx';
import CompletedActionSidebar from './partials/CompletedAction/CompletedActionSidebar.tsx';
import CreateActionSidebar from './partials/CreateAction/CreateActionSidebar.tsx';

const displayName = 'v5.common.ActionSidebar';

interface Props {
  initialValues?: FieldValues;
  userNavigation?: ReactNode;
}

const ActionSidebar: FC<Props> = ({ initialValues, userNavigation }) => {
  const [searchParams] = useSearchParams();

  const GroupedActionSidebar = useGetGroupedActionComponent();

  const txId = searchParams.get(TX_SEARCH_PARAM);

  if (txId) {
    return (
      <CompletedActionSidebar
        transactionId={txId}
        userNavigation={userNavigation}
      />
    );
  }

  if (GroupedActionSidebar) {
    return <GroupedActionSidebar />;
  }

  return (
    <CreateActionSidebar
      defaultValues={initialValues}
      userNavigation={userNavigation}
    />
  );
};

ActionSidebar.displayName = displayName;

export default ActionSidebar;
