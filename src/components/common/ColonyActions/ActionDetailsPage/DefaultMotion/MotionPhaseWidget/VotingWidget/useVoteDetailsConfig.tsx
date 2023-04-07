import { BigNumber } from 'ethers';
import React from 'react';

import { useAppContext, useColonyContext, useUserReputation } from '~hooks';
import { DetailItemProps } from '~shared/DetailsWidget';
import MemberReputation from '~shared/MemberReputation';
import { intl } from '~utils/intl';
import { MotionState } from '~utils/colonyMotions';
import { useGetVoterRewardsQuery } from '~gql';

import { RevealRewardItem, RevealButton } from '../RevealWidget';
import { VoteDetailsProps, VoteButton, VoteRewardItem } from '.';

const { formatMessage } = intl({
  'label.votingMethod': 'Voting method',
  'value.votingMethod': 'Reputation-weighted',
  'tooltip.votingMethod':
    'Votes are weighted by reputation in the team in which the vote is happening.',
  'label.reputationTeam': 'Reputation in team',
  'tooltip.reputationTeam':
    'This is the % of the reputation you have in this team.',
  'label.reward': 'Reward',
  'tooltip.reward': `This is the range of values between which your reward for voting will be, subject to the number of people that participate in the vote.`,
  'label.rules': 'Rules',
  'tooltip.rules':
    'Votes are secret and must be revealed at the end of the voting period to count.',
});

interface VoteDetailsConfig extends DetailItemProps {
  label: string;
}

export const useVoteDetailsConfig = ({
  motionState,
  motionData: { motionId, motionDomainId, rootHash },
  hasUserVoted,
  userVoteRevealed = false,
}: VoteDetailsProps): VoteDetailsConfig[] => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { userReputation, totalReputation } = useUserReputation(
    colony?.colonyAddress ?? '',
    user?.walletAddress ?? '',
    Number(motionDomainId),
  );

  const { data } = useGetVoterRewardsQuery({
    variables: {
      input: {
        voterAddress: user?.walletAddress ?? '',
        colonyAddress: colony?.colonyAddress ?? '',
        motionDomainId,
        motionId,
        rootHash,
      },
    },
    skip: !user || !colony,
    fetchPolicy: 'network-only',
  });

  const {
    max: maxReward,
    min: minReward,
    reward: voterReward,
  } = data?.getVoterRewards || {};
  const hasReputationToVote = BigNumber.from(userReputation ?? 0).gt(0);

  const config = [
    {
      label: formatMessage({ id: 'label.votingMethod' }),
      tooltipText: formatMessage({ id: 'tooltip.votingMethod' }),
      item: formatMessage({ id: 'value.votingMethod' }),
    },
    {
      label: formatMessage({ id: 'label.rules' }),
      tooltipText: formatMessage({ id: 'tooltip.rules' }),
      item:
        motionState === MotionState.Voting ? (
          <VoteButton
            hasReputationToVote={hasReputationToVote}
            hasUserVoted={hasUserVoted}
          />
        ) : (
          <RevealButton
            hasUserVoted={hasUserVoted}
            userVoteRevealed={userVoteRevealed}
          />
        ),
    },
  ];

  if (hasReputationToVote) {
    config.splice(
      1,
      0,
      {
        label: formatMessage({ id: 'label.reputationTeam' }),
        tooltipText: formatMessage({ id: 'tooltip.reputationTeam' }),
        item: (
          <MemberReputation
            userReputation={userReputation}
            totalReputation={totalReputation}
          />
        ),
      },
      {
        label: formatMessage({ id: 'label.reward' }),
        tooltipText: formatMessage({ id: 'tooltip.reward' }),
        item:
          motionState === MotionState.Voting ? (
            <VoteRewardItem minReward={minReward} maxReward={maxReward} />
          ) : (
            <RevealRewardItem voterReward={voterReward} />
          ),
      },
    );
  }

  return config;
};
