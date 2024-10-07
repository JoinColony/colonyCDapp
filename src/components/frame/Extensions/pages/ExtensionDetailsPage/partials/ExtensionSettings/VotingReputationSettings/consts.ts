import { Extension } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

enum GovernanceInitializationParams {
  maxVoteFraction = 'maxVoteFraction',
  totalStakeFraction = 'totalStakeFraction',
  voterRewardFraction = 'voterRewardFraction',
  userMinStakeFraction = 'userMinStakeFraction',
  stakePeriod = 'stakePeriod',
  submitPeriod = 'submitPeriod',
  revealPeriod = 'revealPeriod',
  // escalationPeriod = 'escalationPeriod', @TODO Re-enable once Motion escalation is implemented
}

const votingReputationName = 'extensions.VotingReputation';

const MSG = defineMessages({
  totalStakeFractionTitle: {
    id: `${votingReputationName}.totalStakeFractionTitle`,
    defaultMessage: 'Required Stake',
  },
  totalStakeFractionDescription: {
    id: `${votingReputationName}.totalStakeFractionDescription`,
    defaultMessage:
      "Percentage of the team's reputation, in token terms, should need to stake on each side of a motion",
  },
  voterRewardFractionTitle: {
    id: `${votingReputationName}.voterRewardFractionTitle`,
    defaultMessage: 'Voter Reward',
  },
  voterRewardFractionDescription: {
    id: `${votingReputationName}.voterRewardFractionDescription`,
    defaultMessage:
      "In a dispute, the percentage of the losing side's stake should be awarded to the voters",
  },
  userMinStakeFractionTitle: {
    id: `${votingReputationName}.userMinStakeFractionTitle`,
    defaultMessage: 'Minimum Stake',
  },
  userMinStakeFractionDescription: {
    id: `${votingReputationName}.userMinStakeFractionDescription`,
    defaultMessage:
      'Minimum percentage of the total stake that each staker should have to provide',
  },
  maxVoteFractionTitle: {
    id: `${votingReputationName}.maxVoteFractionTitle`,
    defaultMessage: 'End Vote Threshold',
  },
  maxVoteFractionDescription: {
    id: `${votingReputationName}.maxVoteFractionDescription`,
    defaultMessage:
      'Threshold of reputation having voted should the voting period to end',
  },
  stakePeriodTitle: {
    id: `${votingReputationName}.stakePeriodTitle`,
    defaultMessage: 'Staking Phase Duration',
  },
  stakePeriodDescription: {
    id: `${votingReputationName}.stakePeriodDescription`,
    defaultMessage: 'How long allowed for each side of a motion to get staked',
  },
  submitPeriodTitle: {
    id: `${votingReputationName}.submitPeriodTitle`,
    defaultMessage: 'Voting Phase Duration',
  },
  submitPeriodDescription: {
    id: `${votingReputationName}.submitPeriodDescription`,
    defaultMessage: 'How long allowed for members to cast their votes',
  },
  revealPeriodTitle: {
    id: `${votingReputationName}.revealPeriodTitle`,
    defaultMessage: 'Reveal Phase Duration',
  },
  revealPeriodDescription: {
    id: `${votingReputationName}.revealPeriodDescription`,
    defaultMessage: 'How long allowed for members to reveal their votes',
  },
});

export const paramsMap = {
  [Extension.VotingReputation]: {
    [GovernanceInitializationParams.totalStakeFraction]: {
      complementaryLabel: 'percent',
      title: MSG.totalStakeFractionTitle,
      description: MSG.totalStakeFractionDescription,
    },
    [GovernanceInitializationParams.voterRewardFraction]: {
      complementaryLabel: 'percent',
      title: MSG.voterRewardFractionTitle,
      description: MSG.voterRewardFractionDescription,
    },
    [GovernanceInitializationParams.userMinStakeFraction]: {
      complementaryLabel: 'percent',
      title: MSG.userMinStakeFractionTitle,
      description: MSG.userMinStakeFractionDescription,
    },
    [GovernanceInitializationParams.maxVoteFraction]: {
      complementaryLabel: 'percent',
      title: MSG.maxVoteFractionTitle,
      description: MSG.maxVoteFractionDescription,
    },
    [GovernanceInitializationParams.stakePeriod]: {
      complementaryLabel: 'hours',
      title: MSG.stakePeriodTitle,
      description: MSG.stakePeriodDescription,
    },
    [GovernanceInitializationParams.submitPeriod]: {
      complementaryLabel: 'hours',
      title: MSG.submitPeriodTitle,
      description: MSG.submitPeriodDescription,
    },
    [GovernanceInitializationParams.revealPeriod]: {
      complementaryLabel: 'hours',
      title: MSG.revealPeriodTitle,
      description: MSG.revealPeriodDescription,
    },
    /*
     * @TODO Re-enable once Motion escalation is implemented
     */
    // [GovernanceInitializationParams.escalationPeriod]: {
    //   complementaryLabel: 'hours',
    //   title: MSG.escalationPeriodTitle,
    //   description: MSG.escalationPeriodDescription,
    // },
  },
};
