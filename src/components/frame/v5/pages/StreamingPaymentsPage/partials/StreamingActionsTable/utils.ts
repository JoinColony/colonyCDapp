import { type SortingState } from '@tanstack/react-table';
import { orderBy } from 'lodash';

import { type ColonyFragment } from '~gql';
import { findDomainByNativeId } from '~utils/domains.ts';

import { type StreamingActionTableFieldModel } from '../StreamingPaymentsTable/types.ts';

export const orderActions = (
  actions: StreamingActionTableFieldModel[],
  sorting: SortingState,
  colony: ColonyFragment,
) => {
  const { id, desc } = sorting[0];

  switch (id) {
    case 'totalStreamedAmount':
      return actions
        ? [...actions].sort((a, b) => {
            const diff =
              BigInt(a.totalStreamedAmount) - BigInt(b.totalStreamedAmount);

            if (diff > 0n) return desc ? 1 : -1;
            if (diff < 0n) return desc ? -1 : 1;
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
      return [...actions].sort((a, b) => {
        const nameA =
          findDomainByNativeId(a.nativeDomainId, colony)?.metadata?.name || '';
        const nameB =
          findDomainByNativeId(b.nativeDomainId, colony)?.metadata?.name || '';

        return desc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });

    default:
      return actions;
  }
};
