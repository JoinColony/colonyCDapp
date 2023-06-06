import { AccordionContent } from '~shared/Extensions/Accordion/types';
import { RadioItemProps } from '~shared/Extensions/Fields/RadioList/types';

export const mockedGovernance: RadioItemProps[] = [
  {
    value: 'radio-button-1',
    label: 'Speed over security',
    description: '3-day staking and voting periods, 60% quorum.',
  },
  {
    value: 'radio-button-2',
    label: 'Security over speed',
    description: '5-day staking and voting periods, 80% quorum.',
  },
  {
    value: 'radio-button-3',
    label: 'Testing governance',
    description: 'Do everything fast to figure out how things work.',
  },
  {
    value: 'radio-button-4',
    label: 'Custom (Advanced)',
    description: 'I know what I’m doing and want to configure it myself.',
  },
];

export const extensionContentSpeedOverSecurity: AccordionContent[] = [
  {
    paramName: 'totalStakeFraction',
    complementaryLabel: 'percent',
    title: 'Required Stake',
    defaultValue: 1,
    maxValue: 50,
  },
  {
    paramName: 'voterRewardFraction',
    complementaryLabel: 'percent',
    title: 'Voter Reward',
    defaultValue: 20,
    maxValue: 50,
  },
  {
    paramName: 'userMinStakeFraction',
    complementaryLabel: 'percent',
    title: 'Minimum Stake',
    defaultValue: 1,
    maxValue: 100,
  },
  {
    paramName: 'maxVoteFraction',
    complementaryLabel: 'percent',
    title: 'End Vote Threshold',
    defaultValue: 60,
    maxValue: 100,
  },
  {
    paramName: 'stakePeriod',
    complementaryLabel: 'hours',
    title: 'Staking Phase Duration',
    defaultValue: 72,
    maxValue: 8760,
  },
  {
    paramName: 'submitPeriod',
    complementaryLabel: 'hours',
    title: 'Voting Phase Duration',
    defaultValue: 72,
    maxValue: 8760,
  },
  {
    paramName: 'revealPeriod',
    complementaryLabel: 'hours',
    title: 'Reveal Phase Duration',
    defaultValue: 42,
    maxValue: 8760,
  },
  {
    paramName: 'escalationPeriod',
    complementaryLabel: 'hours',
    title: 'Escalation Phase Duration',
    defaultValue: 48,
    maxValue: 8760,
  },
];

export const extensionContentSecurityOverSpeed: AccordionContent[] = [
  {
    paramName: 'totalStakeFraction',
    complementaryLabel: 'percent',
    title: 'Required Stake',
    defaultValue: 1,
    maxValue: 50,
  },
  {
    paramName: 'voterRewardFraction',
    complementaryLabel: 'percent',
    title: 'Voter Reward',
    defaultValue: 20,
    maxValue: 50,
  },
  {
    paramName: 'userMinStakeFraction',
    complementaryLabel: 'percent',
    title: 'Minimum Stake',
    defaultValue: 1,
    maxValue: 100,
  },
  {
    paramName: 'maxVoteFraction',
    complementaryLabel: 'percent',
    title: 'End Vote Threshold',
    defaultValue: 80,
    maxValue: 100,
  },
  {
    paramName: 'stakePeriod',
    complementaryLabel: 'hours',
    title: 'Staking Phase Duration',
    defaultValue: 120,
    maxValue: 8760,
  },
  {
    paramName: 'submitPeriod',
    complementaryLabel: 'hours',
    title: 'Voting Phase Duration',
    defaultValue: 120,
    maxValue: 8760,
  },
  {
    paramName: 'revealPeriod',
    complementaryLabel: 'hours',
    title: 'Reveal Phase Duration',
    defaultValue: 72,
    maxValue: 8760,
  },
  {
    paramName: 'escalationPeriod',
    complementaryLabel: 'hours',
    title: 'Escalation Phase Duration',
    defaultValue: 72,
    maxValue: 8760,
  },
];

export const extensionContentTestingGovernance: AccordionContent[] = [
  {
    paramName: 'totalStakeFraction',
    complementaryLabel: 'percent',
    title: 'Required Stake',
    defaultValue: 1,
    maxValue: 50,
  },
  {
    paramName: 'voterRewardFraction',
    complementaryLabel: 'percent',
    title: 'Voter Reward',
    defaultValue: 1,
    maxValue: 50,
  },
  {
    paramName: 'userMinStakeFraction',
    complementaryLabel: 'percent',
    title: 'Minimum Stake',
    defaultValue: 1,
    maxValue: 100,
  },
  {
    paramName: 'maxVoteFraction',
    complementaryLabel: 'percent',
    title: 'End Vote Threshold',
    defaultValue: 51,
    maxValue: 100,
  },
  {
    paramName: 'stakePeriod',
    complementaryLabel: 'hours',
    title: 'Staking Phase Duration',
    defaultValue: 0.083,
    maxValue: 8760,
  },
  {
    paramName: 'submitPeriod',
    complementaryLabel: 'hours',
    title: 'Voting Phase Duration',
    defaultValue: 0.083,
    maxValue: 8760,
  },
  {
    paramName: 'revealPeriod',
    complementaryLabel: 'hours',
    title: 'Reveal Phase Duration',
    defaultValue: 0.083,
    maxValue: 8760,
  },
  {
    paramName: 'escalationPeriod',
    complementaryLabel: 'hours',
    title: 'Escalation Phase Duration',
    defaultValue: 0.083,
    maxValue: 8760,
  },
];
