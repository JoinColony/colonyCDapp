import { type SortingState } from '@tanstack/react-table';
import { orderBy } from 'lodash';

import { type StreamingActionTableFieldModel } from '../StreamingPaymentsTable/types.ts';

export const orderActions = (
  actions: StreamingActionTableFieldModel[],
  sorting: SortingState,
) => {
  const { id, desc } = sorting[0];

  switch (id) {
    case 'totalStreamedAmount':
      return actions
        ? [...actions].sort((a, b) => {
            const diff =
              BigInt(a.totalStreamedAmount) - BigInt(b.totalStreamedAmount);

            if (diff > 0n) return desc ? -1 : 1;
            if (diff < 0n) return desc ? 1 : -1;
            return 0;
          })
        : [];
    case 'token':
      return orderBy(
        actions,
        (action) => action.token?.symbol,
        desc && ['desc'],
      );
    case 'team':
      return orderBy(actions, ['nativeDomainId'], desc && ['desc']);
    default:
      return actions;
  }
};
