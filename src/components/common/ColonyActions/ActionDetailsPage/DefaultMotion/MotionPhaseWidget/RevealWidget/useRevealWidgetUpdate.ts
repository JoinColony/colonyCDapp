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
  const vote = currentVotingRecord?.vote ?? null;
  const [prevVote, setPrevVote] = useState(vote);
  const [userVoteRevealed, setUserVoteRevealed] = useState(vote !== null);

  /* Keep revealed state in sync with user changes */
  useEffect(() => {
    if (!user) {
      setUserVoteRevealed(false);
    } else {
      setUserVoteRevealed(typeof vote === 'number');
    }
  }, [user, vote]);

  /* Vote has been updated in db, stop polling */
  if (vote !== prevVote) {
    stopPollingAction();
    setPrevVote(vote);
  }

  useEffect(() => stopPollingAction, [stopPollingAction]);

  return { hasUserVoted, vote, userVoteRevealed, setUserVoteRevealed };
};
