// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

declare module '@tanstack/react-table' {
  export interface ColumnSizingColumnDef {
    staticSize?: string;
  }
}
