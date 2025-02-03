import { BigNumber } from 'ethers';
import { useEffect, useMemo, useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetVoterRewardsQuery } from '~gql';
import { type RevealMotionPayload } from '~redux/sagas/motions/revealVoteMotion.ts';
import { type OnSuccess } from '~shared/Fields/index.ts';
import { type VoterRecord } from '~types/graphql.ts';
import { getMotionAssociatedActionId, mapPayload } from '~utils/actions.ts';
import { type ICompletedMotionAction } from '~v5/common/ActionSidebar/partials/Motions/types.ts';

import { getLocalStorageVoteValue } from '../VotingStep/utils.tsx';

const useRevealWidgetUpdate = (voterRecord: VoterRecord[]) => {
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
    setPrevVote(vote);
  }

  return { hasUserVoted, vote, userVoteRevealed, setUserVoteRevealed };
};

export const useRevealStep = ({
  action,
  transactionHash,
  rootHash,
}: {
  action: ICompletedMotionAction['action'];
  transactionHash: string;
  rootHash: string | undefined;
}) => {
  const { motionData } = action;
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
    useRevealWidgetUpdate(voterRecord || []);

  const associatedActionId = getMotionAssociatedActionId(action);

  const transform = useMemo(
    () =>
      mapPayload(
        (): RevealMotionPayload => ({
          associatedActionId,
          colonyAddress,
          userAddress: user?.walletAddress ?? '',
          motionId: BigNumber.from(motionId),
        }),
      ),
    [associatedActionId, colonyAddress, user?.walletAddress, motionId],
  );

  const handleSuccess: OnSuccess<Record<string, number>> = (_, { reset }) => {
    reset();
    setUserVoteRevealed(true);
  };

  const voters = (voterRecord || []).map((voter) => ({
    address: voter.address,
    hasRevealed: voter.vote !== null,
  }));
  const userVote =
    hasUserVoted && (vote || getLocalStorageVoteValue(transactionHash));
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
