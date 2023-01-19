import { DecisionDialogValues } from '~common/ColonyDecisions/DecisionDialog';
import { Address, Decision } from '~types';

const getLocalStorageDecisionKey = (walletAddress: Address) =>
  `decision:${walletAddress}`;

export const getDecisionFromLocalStorage = (walletAddress: Address) => {
  const savedDraft = localStorage.getItem(
    getLocalStorageDecisionKey(walletAddress),
  );
  return savedDraft ? (JSON.parse(savedDraft) as Decision) : undefined;
};

export const setDecisionToLocalStorage = (
  values: DecisionDialogValues,
  walletAddress: Address,
) => {
  localStorage.setItem(
    getLocalStorageDecisionKey(walletAddress),
    JSON.stringify({ ...values, walletAddress }),
  );
};

export const removeDecisionFromLocalStorage = (walletAddress: Address) => {
  localStorage.removeItem(getLocalStorageDecisionKey(walletAddress));
};
