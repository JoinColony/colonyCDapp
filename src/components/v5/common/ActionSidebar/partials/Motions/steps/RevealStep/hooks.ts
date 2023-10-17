import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { useRevealWidgetUpdate } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/RevealWidget/useRevealWidgetUpdate';
import { useGetVoterRewardsQuery } from '~gql';
import { useAppContext, useColonyContext } from '~hooks';
import { OnSuccess } from '~shared/Fields';
import { mapPayload } from '~utils/actions';
import { getLocalStorageVoteValue } from '../VotingStep/utils';
import { MotionVote } from '~utils/colonyMotions';
import { ColonyMotion } from '~types';

export const useRevealStep = (
  motionData: ColonyMotion | undefined | null,
  startPollingAction: (pollingInterval: number) => void,
  stopPollingAction: () => void,
  transactionId: string,
) => {
  const { nativeMotionDomainId, voterRecord, rootHash, motionId } =
    motionData || {};
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { nativeToken } = colony || {};
  const { data } = useGetVoterRewardsQuery({
    variables: {
      input: {
        voterAddress: user?.walletAddress ?? '',
        colonyAddress: colony?.colonyAddress ?? '',
        nativeMotionDomainId: nativeMotionDomainId || '',
        motionId: motionId || '',
        rootHash: rootHash || '',
      },
    },
    skip: !user || !colony,
    fetchPolicy: 'cache-and-network',
  });

  const { reward: voterReward } = data?.getVoterRewards || {};

  const { vote, hasUserVoted, userVoteRevealed, setUserVoteRevealed } =
    useRevealWidgetUpdate(voterRecord || [], stopPollingAction);
  const transform = mapPayload(() => ({
    colonyAddress: colony?.colonyAddress,
    userAddress: user?.walletAddress ?? '',
    motionId: BigNumber.from(motionId),
  }));

  const handleSuccess: OnSuccess<Record<string, number>> = (_, { reset }) => {
    reset();
    startPollingAction(1000);
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
