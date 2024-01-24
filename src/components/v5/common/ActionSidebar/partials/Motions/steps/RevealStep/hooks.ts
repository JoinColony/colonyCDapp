import { BigNumber } from 'ethers';
import { useEffect, useMemo, useState } from 'react';

import { useAppContext } from '~context/AppContext';
import { useColonyContext } from '~context/ColonyContext';
import { useGetVoterRewardsQuery } from '~gql';
import { OnSuccess } from '~shared/Fields';
import { ColonyMotion, VoterRecord } from '~types/graphql';
import { mapPayload } from '~utils/actions';
import { MotionVote } from '~utils/colonyMotions';
import { getSafePollingInterval } from '~utils/queries';

import { getLocalStorageVoteValue } from '../VotingStep/utils';

const useRevealWidgetUpdate = (
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

  return { hasUserVoted, vote, userVoteRevealed, setUserVoteRevealed };
};

export const useRevealStep = (
  motionData: ColonyMotion | undefined | null,
  startPollingAction: (pollingInterval: number) => void,
  stopPollingAction: () => void,
  transactionId: string,
) => {
  const { nativeMotionDomainId, voterRecord, rootHash, motionId } =
    motionData || {};
  const { user } = useAppContext();
  const {
    colony: { colonyAddress, nativeToken },
  } = useColonyContext();
  const { data } = useGetVoterRewardsQuery({
    variables: {
      input: {
        voterAddress: user?.walletAddress ?? '',
        colonyAddress,
        nativeMotionDomainId: nativeMotionDomainId || '',
        motionId: motionId || '',
        rootHash: rootHash || '',
      },
    },
    skip: !user,
    fetchPolicy: 'cache-and-network',
  });

  const { reward: voterReward } = data?.getVoterRewards || {};

  const { vote, hasUserVoted, userVoteRevealed, setUserVoteRevealed } =
    useRevealWidgetUpdate(voterRecord || [], stopPollingAction);
  const transform = mapPayload(() => ({
    colonyAddress,
    userAddress: user?.walletAddress ?? '',
    motionId: BigNumber.from(motionId),
  }));

  const handleSuccess: OnSuccess<Record<string, number>> = (_, { reset }) => {
    reset();
    startPollingAction(getSafePollingInterval());
    setUserVoteRevealed(true);
  };

  const voters = (voterRecord || []).map((voter) => ({
    address: voter.address,
    hasRevealed: voter.vote !== null,
  }));
  const userVote =
    hasUserVoted && (vote || getLocalStorageVoteValue(transactionId));
  const isSupportVote = userVote === MotionVote.Yay;
  const revealProgress = useMemo(
    () =>
      (voterRecord || []).reduce(
        (acc, voter) => (voter.vote !== null ? acc + 1 : acc),
        0,
      ),
    [voterRecord],
  );
  const totalVoters = (voterRecord || []).length;

  return {
    hasUserVoted,
    nativeToken,
    voterReward,
    userVoteRevealed,
    voters,
    transform,
    handleSuccess,
    isSupportVote,
    revealProgress,
    totalVoters,
  };
};
