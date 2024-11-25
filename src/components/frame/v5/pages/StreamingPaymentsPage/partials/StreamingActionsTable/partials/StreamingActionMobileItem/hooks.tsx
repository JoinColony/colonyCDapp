import { type Row } from '@tanstack/react-table';
import React from 'react';

import { type StreamingActionTableFieldModel } from '~frame/v5/pages/StreamingPaymentsPage/partials/StreamingPaymentsTable/types.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import StreamingActionMobileItem from './StreamingActionMobileItem.tsx';

const useRenderSubComponent = ({
  getMenuProps,
}: {
  getMenuProps: (
    row: Row<StreamingActionTableFieldModel>,
  ) => MeatBallMenuProps | undefined;
}) => {
  return ({ row }: { row: Row<StreamingActionTableFieldModel> }) => (
    <StreamingActionMobileItem actionRow={row} getMenuProps={getMenuProps} />
  );
};

export default useRenderSubComponent;
