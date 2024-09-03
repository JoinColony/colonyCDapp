import { BigNumber } from 'ethers';
import { useEffect, useMemo, useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetVoterRewardsQuery } from '~gql';
import { type OnSuccess } from '~shared/Fields/index.ts';
import { type ColonyMotion, type VoterRecord } from '~types/graphql.ts';
import { mapPayload } from '~utils/actions.ts';
import { getSafePollingInterval } from '~utils/queries.ts';

import { getLocalStorageVoteValue } from '../VotingStep/utils.tsx';

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

export const useRevealStep = ({
  motionData,
  startPollingAction,
  stopPollingAction,
  transactionId,
  rootHash,
}: {
  motionData: ColonyMotion | undefined | null;
  startPollingAction: (pollingInterval: number) => void;
  stopPollingAction: () => void;
  transactionId: string;
  rootHash: string | undefined;
}) => {
  const { nativeMotionDomainId, voterRecord, motionId } = motionData || {};
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
  const transform = useMemo(
    () =>
      mapPayload(() => ({
        colonyAddress,
        userAddress: user?.walletAddress ?? '',
        motionId: BigNumber.from(motionId),
      })),
    [colonyAddress, user?.walletAddress, motionId],
  );

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
    userVote,
    revealProgress,
    totalVoters,
  };
};
