import { type Row } from '@tanstack/react-table';
import React from 'react';

import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import { type RefetchMotionStates } from '~hooks/useNetworkMotionStates.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import ActionMobileDescription from '../partials/ActionMobileDescription/index.ts';

const useRenderSubComponent = (
  loadingMotionStates: boolean,
  refetchMotionStates: RefetchMotionStates,
  getMenuProps: (
    row: Row<ActivityFeedColonyAction>,
  ) => MeatBallMenuProps | undefined,
) => {
  return ({ row }: { row: Row<ActivityFeedColonyAction> }) => (
    <ActionMobileDescription
      actionRow={row}
      loadingMotionStates={loadingMotionStates}
      refetchMotionStates={refetchMotionStates}
      getMenuProps={getMenuProps}
    />
  );
};

export default useRenderSubComponent;
