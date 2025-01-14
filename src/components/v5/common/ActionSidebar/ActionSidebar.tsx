import React, { type ReactNode, type FC } from 'react';
import { useSearchParams } from 'react-router-dom';

import { TX_SEARCH_PARAM } from '~routes';

import CompletedActionSidebar from '../CompletedAction/CompletedActionSidebar.tsx';

import useGetGroupedActionComponent from './hooks/useGetGroupedActionComponent.tsx';
import CreateActionSidebar from './partials/CreateAction/CreateActionSidebar.tsx';

const displayName = 'v5.common.ActionSidebar';

interface Props {
  userNavigation?: ReactNode;
}

const ActionSidebar: FC<Props> = ({ userNavigation }) => {
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

  return <CreateActionSidebar userNavigation={userNavigation} />;
};

ActionSidebar.displayName = displayName;

export default ActionSidebar;
