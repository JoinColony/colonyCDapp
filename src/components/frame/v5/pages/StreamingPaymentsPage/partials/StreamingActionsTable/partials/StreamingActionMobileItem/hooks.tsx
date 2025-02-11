import { type Row } from '@tanstack/react-table';
import React from 'react';

import { type StreamingActionTableFieldModel } from '~frame/v5/pages/StreamingPaymentsPage/partials/StreamingPaymentsTable/types.ts';

import StreamingActionMobileItem from './StreamingActionMobileItem.tsx';

const useRenderSubComponent = () => {
  return ({ row }: { row: Row<StreamingActionTableFieldModel> }) => (
    <StreamingActionMobileItem actionRow={row} />
  );
};

export default useRenderSubComponent;
