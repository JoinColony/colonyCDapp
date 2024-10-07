import { useMemo } from 'react';

// FIXME: Rename ColonyAction (the one from actions) everywhere to something else
import { type ActionData } from '~actions/index.ts';
import { DecisionMethod } from '~gql';

// FIXME: This can be removed as soon as xxxMotion and xxxMultiSig types are removed (then this will be in ColonyAction.decisionMethod)
export const useDecisionMethod = ({ isMotion, isMultiSig }: ActionData) => {
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
