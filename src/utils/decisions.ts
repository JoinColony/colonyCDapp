import { CORE_DECISIONS, CORE_DECISIONS_LIST } from '~redux/constants';
import { CoreDecisionsRecord } from '~redux/state/decisions';
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
  values: Decision,
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

export const getDecisionFromStore =
  (walletAddress: string) => (state: CoreDecisionsRecord) =>
    state.getIn([CORE_DECISIONS, CORE_DECISIONS_LIST, walletAddress]) as
      | Decision
      | undefined;
