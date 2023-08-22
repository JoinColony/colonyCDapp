import { Extension } from '@colony/colony-js';
import { TabItem } from '~shared/Extensions/Tabs/types';
import LazyConsensusPageSetup from '../LazyConsensusPage/LazyConsensusPageSetup';

export const tabsItems: Partial<{
  [k in Extension]: TabItem[];
}> = {
  [Extension.VotingReputation]: [
    { id: 0, title: 'Overview' },
    { id: 1, title: 'Extension settings' },
  ],
};

export const ExtensionsBadgeMap = {
  [Extension.VotingReputation]: 'governance',
  [Extension.OneTxPayment]: 'payments',
};

export const SetupComponentMap = {
  [Extension.VotingReputation]: LazyConsensusPageSetup,
};

enum GovernanceInitializationParams {
  maxVoteFraction = 'maxVoteFraction',
  totalStakeFraction = 'totalStakeFraction',
  voterRewardFraction = 'voterRewardFraction',
  userMinStakeFraction = 'userMinStakeFraction',
  stakePeriod = 'stakePeriod',
  submitPeriod = 'submitPeriod',
  revealPeriod = 'revealPeriod',
  escalationPeriod = 'escalationPeriod',
}

export const paramsMap = {
  [Extension.VotingReputation]: {
    [GovernanceInitializationParams.totalStakeFraction]: {
      complementaryLabel: 'percent',
      title: 'Required Stake',
      description:
        "Percentage of the team's reputation, in token terms, should need to stake on each side of a motion",
    },
    [GovernanceInitializationParams.voterRewardFraction]: {
      complementaryLabel: 'percent',
      title: 'Voter Reward',
      description:
        "In a dispute, the percentage of the losing side's stake should be awarded to the voters",
    },
    [GovernanceInitializationParams.userMinStakeFraction]: {
      complementaryLabel: 'percent',
      title: 'Minimum Stake',
      description:
        'Minimum percentage of the total stake that each staker should have to provide',
    },
    [GovernanceInitializationParams.maxVoteFraction]: {
      complementaryLabel: 'percent',
      title: 'End Vote Threshold',
      description:
        'Threshold of reputation having voted should the voting period to end',
    },
    [GovernanceInitializationParams.stakePeriod]: {
      complementaryLabel: 'hours',
      title: 'Staking Phase Duration',
      description: 'How long allowed for each side of a motion to get staked',
    },
    [GovernanceInitializationParams.submitPeriod]: {
      complementaryLabel: 'hours',
      title: 'Voting Phase Duration',
      description: 'How long allowed for members to cast their votes',
    },
    [GovernanceInitializationParams.revealPeriod]: {
      complementaryLabel: 'hours',
      title: 'Reveal Phase Duration',
      description: 'How long allowed for members to reveal their votes',
    },
    [GovernanceInitializationParams.escalationPeriod]: {
      complementaryLabel: 'hours',
      title: 'Escalation Phase Duration',
      description:
        'How long allowed for members to escalate a dispute to a higher team',
    },
  },
};
