import { CORE_DECISIONS, CORE_DECISIONS_LIST } from '~redux/constants';
import { CoreDecisionsRecord } from '~redux/state/decisions';
import { Address, ColonyDecision } from '~types';

export type DecisionDraft = Omit<
  ColonyDecision,
  '__typename' | 'createdAt' | 'actionId'
>;

const getLocalStorageDraftDecisionKey = (
  walletAddress: Address,
  colonyAddress: Address,
) => `decision:${walletAddress}_${colonyAddress}`;

export const getDraftDecisionFromLocalStorage = (
  walletAddress: Address,
  colonyAddress: Address,
) => {
  const savedDraft = localStorage.getItem(
    getLocalStorageDraftDecisionKey(walletAddress, colonyAddress),
  );
  return savedDraft ? (JSON.parse(savedDraft) as DecisionDraft) : undefined;
};

export const setDraftDecisionToLocalStorage = (
  values: DecisionDraft,
  walletAddress: Address,
  colonyAddress: Address,
) => {
  localStorage.setItem(
    getLocalStorageDraftDecisionKey(walletAddress, colonyAddress),
    JSON.stringify({ ...values, colonyAddress }),
  );
};

export const removeDraftDecisionFromLocalStorage = (
  walletAddress: Address,
  colonyAddress: Address,
) => {
  localStorage.removeItem(
    getLocalStorageDraftDecisionKey(walletAddress, colonyAddress),
  );
};

export const getDraftDecisionFromStore =
  (walletAddress: string, colonyAddress: string) =>
  (state: CoreDecisionsRecord) =>
    state.getIn([
      CORE_DECISIONS,
      CORE_DECISIONS_LIST,
      `${walletAddress}_${colonyAddress}`,
    ]) as DecisionDraft | undefined;
