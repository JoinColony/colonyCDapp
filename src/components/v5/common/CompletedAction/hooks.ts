import { useMemo } from 'react';

import { type ColonyActionFragment } from '~gql';
import { DecisionMethod } from '~types/actions.ts';

export const useDecisionMethod = ({
  isMotion,
  isMultiSig,
}: ColonyActionFragment) => {
  return useMemo(() => {
    if (isMotion) {
      return DecisionMethod.Reputation;
    }
    if (isMultiSig) {
      return DecisionMethod.MultiSig;
    }

    return DecisionMethod.Permissions;
  }, [isMotion, isMultiSig]);
};
