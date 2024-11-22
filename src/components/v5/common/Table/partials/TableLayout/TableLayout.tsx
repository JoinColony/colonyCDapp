import React from 'react';

import { HorizontalLayout } from './HorizontalLayout.tsx';
import {
  type HorizontalLayoutProps,
  type TableLayoutProps,
  type VerticalLayoutProps,
} from './types.ts';
import { VerticalLayout } from './VerticalLayout.tsx';

export const TableLayout = <T,>({
  verticalLayout,
  ...props
}: TableLayoutProps<T>) => {
  return verticalLayout ? (
    <VerticalLayout {...(props as VerticalLayoutProps<T>)} />
  ) : (
    <HorizontalLayout {...(props as HorizontalLayoutProps<T>)} />
  );
};
