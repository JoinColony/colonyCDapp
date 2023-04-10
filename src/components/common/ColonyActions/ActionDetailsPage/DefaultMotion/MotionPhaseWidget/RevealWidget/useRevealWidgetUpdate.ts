import { useEffect, useState } from 'react';

import { VoterRecord } from '~gql';
import { useAppContext } from '~hooks';

export const useRevealWidgetUpdate = (
  voterRecord: VoterRecord[],
  stopPollingAction: () => void,
) => {
  const { user } = useAppContext();
  const currentVotingRecord = voterRecord.find(
    ({ address }) => address === user?.walletAddress,
  );
  const hasUserVoted = !!currentVotingRecord;
  const vote = currentVotingRecord?.vote;
  const [prevVote, setPrevVote] = useState(vote);

  /* Vote has been updated in db, stop polling */
  if (vote !== prevVote) {
    stopPollingAction();
    setPrevVote(vote);
  }

  useEffect(() => stopPollingAction, [stopPollingAction]);

  return { hasUserVoted, vote };
};
