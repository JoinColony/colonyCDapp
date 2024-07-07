import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';

export const getDomainFormActionType = (
  decisionMethod: DecisionMethod | undefined,
) => {
  switch (decisionMethod) {
    case DecisionMethod.Reputation:
      return ActionTypes.MOTION_REPUTATION_DOMAIN_CREATE_EDIT;
    case DecisionMethod.MultiSig:
      return ActionTypes.MOTION_MULTISIG_DOMAIN_CREATE_EDIT;
    default:
      return ActionTypes.MOTION_DOMAIN_CREATE_EDIT;
  }
};
