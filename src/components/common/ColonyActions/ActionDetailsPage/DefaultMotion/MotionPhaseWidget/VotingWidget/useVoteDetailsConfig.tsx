import React from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';
import { useAppContext, useColonyContext, useUserReputation } from '~hooks';
import { DetailItemProps } from '~shared/DetailsWidget';
import MemberReputation from '~shared/MemberReputation';
import { MotionState } from '~utils/colonyMotions';
import { formatText } from '~utils/intl';
import VoteReward from './VoteReward';

const MSG = defineMessages({
  votingMethodLabel: {
    id: 'dashboard.ActionsPage.VoteWidget.votingMethodLabel',
    defaultMessage: `Voting method`,
  },
  votingMethodValue: {
    id: 'dashboard.ActionsPage.VoteWidget.votingMethodValue',
    defaultMessage: `Reputation-weighted`,
  },
  votingMethodTooltip: {
    id: 'dashboard.ActionsPage.VoteWidget.votingMethodTooltip',
    defaultMessage: `Votes are weighted by reputation in the team in which the vote is happening.`,
  },
  reputationTeamLabel: {
    id: 'dashboard.ActionsPage.VoteWidget.reputationTeamLabel',
    defaultMessage: `Reputation in team`,
  },
  reputationTeamTooltip: {
    id: 'dashboard.ActionsPage.VoteWidget.reputationTeamTooltip',
    defaultMessage: `This is the % of the reputation you have in this team.`,
  },
  rewardLabel: {
    id: 'dashboard.ActionsPage.VoteWidget.rewardLabel',
    defaultMessage: `Reward`,
  },
  rewardTooltip: {
    id: 'dashboard.ActionsPage.VoteWidget.rewardTooltip',
    defaultMessage: `This is the range of values between which your reward for voting will be, subject to the number of people that participate in the vote.`,
  },
  rulesLabel: {
    id: 'dashboard.ActionsPage.VoteWidget.rulesLabel',
    defaultMessage: `Rules`,
  },
  rulesTooltip: {
    id: 'dashboard.ActionsPage.VoteWidget.rulesTooltip',
    defaultMessage: `Votes are secret and must be revealed at the end of the voting period to count.`,
  },
});

interface VoteDetailsConfig extends DetailItemProps {
  label: MessageDescriptor;
}
export const useVoteDetailsConfig = (
  motionState: MotionState,
  button: JSX.Element,
): VoteDetailsConfig[] => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { userReputation, totalReputation } = useUserReputation(
    colony?.colonyAddress ?? '',
    user?.walletAddress ?? '',
  );
  return [
    {
      label: MSG.votingMethodLabel,
      tooltipText: MSG.votingMethodTooltip,
      item: formatText(MSG.votingMethodValue),
    },
    {
      label: MSG.reputationTeamLabel,
      tooltipText: MSG.reputationTeamTooltip,
      item: (
        <MemberReputation
          userReputation={userReputation}
          totalReputation={totalReputation}
        />
      ),
    },
    {
      label: MSG.rewardLabel,
      tooltipText: MSG.rewardTooltip,
      item: <VoteReward motionState={motionState} />,
    },
    {
      label: MSG.rulesLabel,
      tooltipText: MSG.rulesTooltip,
      item: button,
    },
  ];
};
