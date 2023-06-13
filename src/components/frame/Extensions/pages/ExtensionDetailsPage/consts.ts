import { TabItem } from '~shared/Extensions/Tabs/types';

export const tabsItems: TabItem[] = [
  { id: 0, title: 'Overview' },
  { id: 1, title: 'Extension settings' },
];

export const mockedExtensionSettings = [
  {
    complementaryLabel: 'percent',
    title: 'Required Stake',
    description:
      'Percentage of the team’s reputation, in token terms, should need to stake on each side of a motion',
  },
  {
    complementaryLabel: 'percent',
    title: 'Voter Reward',
    description:
      'In a dispute, the percentage of the losing side’s stake should be awarded to the voters',
  },
  {
    complementaryLabel: 'percent',
    title: 'Minimum Stake',
    description:
      'Minimum percentage of the total stake that each staker should have to provide',
  },
  {
    complementaryLabel: 'percent',
    title: 'End Vote Threshold',
    description:
      'Threshold of reputation having voted should the voting period to end',
  },
  {
    complementaryLabel: 'hours',
    title: 'Staking Phase Duration',
    description: 'How long allowed for each side of a motion to get staked',
  },
  {
    complementaryLabel: 'hours',
    title: 'Voting Phase Duration',
    description: 'How long allowed for members to cast their votes',
  },
  {
    complementaryLabel: 'hours',
    title: 'Reveal Phase Duration',
    description: 'How long allowed for members to reveal their votes',
  },
  {
    complementaryLabel: 'hours',
    title: 'Escalation Phase Duration',
    description:
      'How long allowed for members to escalate a dispute to a higher team',
  },
];
