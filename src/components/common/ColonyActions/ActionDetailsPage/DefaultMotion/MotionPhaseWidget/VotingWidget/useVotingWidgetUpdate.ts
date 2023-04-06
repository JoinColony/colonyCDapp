import { useEffect, useState } from 'react';
import { VoterRecord } from '~gql';
import { useAppContext } from '~hooks';

export const useVotingWidgetUpdate = (
  voterRecord: VoterRecord[],
  stopPollingAction: () => void,
) => {
  const { user } = useAppContext();

  const currentVotingRecord = voterRecord.find(
    ({ address }) => address === user?.walletAddress,
  );

  const [prevRecord, setPrevRecord] = useState(currentVotingRecord);
  const [hasUserVoted, setHasUserVoted] = useState(!!currentVotingRecord);

  if (currentVotingRecord && !hasUserVoted) {
    setHasUserVoted(true);
  }

  // if user's vote count increased, db has been updated, stop polling
  if (currentVotingRecord?.voteCount !== prevRecord?.voteCount) {
    stopPollingAction();
    setPrevRecord(currentVotingRecord);
  }

  useEffect(() => stopPollingAction, [stopPollingAction]);

  return { hasUserVoted, setHasUserVoted };
};
