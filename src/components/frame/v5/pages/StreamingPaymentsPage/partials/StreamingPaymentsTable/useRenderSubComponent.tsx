import { type Row } from '@tanstack/react-table';
import React from 'react';

import StreamingActionsTable from '../StreamingActionsTable/StreamingActionsTable.tsx';

import { type StreamingTableFieldModel } from './types.ts';

export const useRenderSubComponent = (loading: boolean) => {
  return ({ row }: { row: Row<StreamingTableFieldModel> }) => (
    <StreamingActionsTable actionRow={row} isLoading={loading} />
  );
};
