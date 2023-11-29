import { BigNumber } from 'ethers';
import { useMemo } from 'react';

import { OnSuccess } from '~shared/Fields';

import { useGetVoterRewardsQuery } from '~gql';
import { useRevealWidgetUpdate } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/RevealWidget/useRevealWidgetUpdate';
import { useAppContext, useColonyContext } from '~hooks';
import { mapPayload } from '~utils/actions';
import { MotionVote } from '~utils/colonyMotions';
import { getSafePollingInterval } from '~utils/queries';
import { ColonyMotion } from '~types';

import { getLocalStorageVoteValue } from '../VotingStep/utils';

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
