import { type MotionVote } from '~utils/colonyMotions.ts';

export const setLocalStorageVoteValue = (transactionId: string, vote: number) =>
  localStorage.setItem(`${transactionId}-vote`, `${vote}`);

export const getLocalStorageVoteValue = (
  transactionId: string,
): MotionVote | null =>
  JSON.parse(localStorage.getItem(`${transactionId}-vote`) || 'null');
