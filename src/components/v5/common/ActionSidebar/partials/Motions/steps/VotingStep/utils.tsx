import { MotionVote } from '~utils/colonyMotions';

import { opposeOption, supportOption } from '../../consts';

export const renderVoteRadioButtons = (
  hasUserVoted: boolean,
  userVote: number,
) => {
  if (!hasUserVoted) {
    return [opposeOption, supportOption];
  }

  if (userVote === MotionVote.Nay) {
    return [supportOption];
  }

  return [opposeOption];
};

export const setLocalStorageVoteValue = (transactionId: string, vote: number) =>
  localStorage.setItem(`${transactionId}-vote`, `${vote}`);

export const getLocalStorageVoteValue = (transactionId: string) =>
  JSON.parse(localStorage.getItem(`${transactionId}-vote`) || 'null');
