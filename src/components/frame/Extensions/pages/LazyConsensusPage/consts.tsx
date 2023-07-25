import { AccordionContent } from '~shared/Extensions/Accordion/types';
import { RadioItemProps } from '~common/Extensions/Fields/RadioList/types';
import {
  CUSTOM,
  SECURITY_OVER_SPEED,
  SPEED_OVER_SECURITY,
  TESTING_GOVERNANCE,
} from '~redux/constants';

export const mockedGovernance: RadioItemProps[] = [
  {
    value: SPEED_OVER_SECURITY,
    label: 'Speed over security',
    description: '3-day staking and voting periods, 60% quorum.',
  },
  {
    value: SECURITY_OVER_SPEED,
    label: 'Security over speed',
    description: '5-day staking and voting periods, 80% quorum.',
  },
  {
    value: TESTING_GOVERNANCE,
    label: 'Testing governance',
    description: 'Do everything fast to figure out how things work.',
  },
  {
    value: CUSTOM,
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
    description:
      'What percentage of the team’s reputation, in token terms, should need to stake on each side of a motion?',
    accordionItemDescription: `If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to be staked to either support or object to a motion.`,
  },
  {
    paramName: 'voterRewardFraction',
    complementaryLabel: 'percent',
    title: 'Voter Reward',
    defaultValue: 20,
    maxValue: 50,
    description:
      'In a dispute, what percentage of the losing side’s stake should be awarded to the voters?',
    accordionItemDescription: `If both the colony members who create a motion, and the colony members who raise an objection stake 50 tokens, and the Voter Reward is 20%, then the voters will share 20 tokens between them, proportional to their reputations (i.e. 20% of the combined stake of both side of the dispute). The remainder will be shared between the stakers proportional to the outcome of the vote.`,
  },
  {
    paramName: 'userMinStakeFraction',
    complementaryLabel: 'percent',
    title: 'Minimum Stake',
    defaultValue: 1,
    maxValue: 100,
    description: `What is the minimum percentage of the total stake that each staker should have to provide?`,
    accordionItemDescription:
      '10% means anybody who wishes to stake must provide at least 10% of the Required Stake.',
  },
  {
    paramName: 'maxVoteFraction',
    complementaryLabel: 'percent',
    title: 'End Vote Threshold',
    defaultValue: 60,
    maxValue: 100,
    description:
      'What is the minimum percentage of the total stake that each staker should have to provide?',
    accordionItemDescription: `If the End Vote Threshold is 70%, then the voting period will end as soon as 70% of the reputation in a team has cast their vote. This helps votes get settled faster. If you want to ensure everyone gets to vote if they want to, set the value to 100%.`,
  },
  {
    paramName: 'stakePeriod',
    complementaryLabel: 'hours',
    title: 'Staking Phase Duration',
    defaultValue: 72,
    maxValue: 8760,
    description:
      'At what threshold of reputation having voted should the voting period to end?',
    accordionItemDescription: `If the staking phase is 72 hours, then once a motion is created members will have 72 hours to provide the full stake required to back the motion. If the motion does not receive the full stake in 72 hours, it will fail. Once the motion has been fully staked, the staking period will reset and members will have a further 72 hours in which to “Object” by staking against the motion if they wish to take the decision to a vote. If the full stake for the objection is not staked, then the motion will automatically pass.`,
  },
  {
    paramName: 'submitPeriod',
    complementaryLabel: 'hours',
    title: 'Voting Phase Duration',
    defaultValue: 72,
    maxValue: 8760,
    description:
      'How long do you want to allow each side of a motion to get staked?',
    accordionItemDescription: `If the vote duration is 72 hours, then after both sides of the motion are fully staked, members with reputation in the team will have 72 hours in which to vote, unless the “End Vote Threshold” is reached, in which case the vote will end early.`,
  },
  {
    paramName: 'revealPeriod',
    complementaryLabel: 'hours',
    title: 'Reveal Phase Duration',
    defaultValue: 42,
    maxValue: 8760,
    description: 'How long do you want to give members to cast their votes?',
    accordionItemDescription: `Votes in colony are secret while the vote is ongoing, and so must be revealed once votes have been cast. If the reveal phase is 72 hours long, then members will have 72 hours to reveal their votes, otherwise their votes will not be counted and they will not receive a share of the voter reward. If all votes are revealed before the end of the reveal phase, then the reveal phase will end.`,
  },
  {
    paramName: 'escalationPeriod',
    complementaryLabel: 'hours',
    title: 'Escalation Phase Duration',
    defaultValue: 48,
    maxValue: 8760,
    description:
      'How long do you wish to allow for members to escalate a dispute to a higher team?',
    accordionItemDescription: `If the escalation phase is 72 hours, once the outcome of a vote is known, if the loser feels the outcome was for any reason incorrect, then they will have 72 hours in which to escalate the dispute to a higher team in the colony by increasing the stake to meet the required stake of that higher team.`,
  },
];

export const extensionContentSecurityOverSpeed: AccordionContent[] = [
  {
    paramName: 'totalStakeFraction',
    complementaryLabel: 'percent',
    title: 'Required Stake',
    defaultValue: 1,
    maxValue: 50,
    description:
      'What percentage of the team’s reputation, in token terms, should need to stake on each side of a motion?',
    accordionItemDescription: `If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to be staked to either support or object to a motion.`,
  },
  {
    paramName: 'voterRewardFraction',
    complementaryLabel: 'percent',
    title: 'Voter Reward',
    defaultValue: 20,
    maxValue: 50,
    description:
      'In a dispute, what percentage of the losing side’s stake should be awarded to the voters?',
    accordionItemDescription: `If both the colony members who create a motion, and the colony members who raise an objection stake 50 tokens, and the Voter Reward is 20%, then the voters will share 20 tokens between them, proportional to their reputations (i.e. 20% of the combined stake of both side of the dispute). The remainder will be shared between the stakers proportional to the outcome of the vote.`,
  },
  {
    paramName: 'userMinStakeFraction',
    complementaryLabel: 'percent',
    title: 'Minimum Stake',
    defaultValue: 1,
    maxValue: 100,
    description: `If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to be staked to either support or object to a motion.`,
    accordionItemDescription:
      '10% means anybody who wishes to stake must provide at least 10% of the Required Stake.',
  },
  {
    paramName: 'maxVoteFraction',
    complementaryLabel: 'percent',
    title: 'End Vote Threshold',
    defaultValue: 80,
    maxValue: 100,
    description:
      'What is the minimum percentage of the total stake that each staker should have to provide?',
    accordionItemDescription: `If the End Vote Threshold is 70%, then the voting period will end as soon as 70% of the reputation in a team has cast their vote. This helps votes get settled faster. If you want to ensure everyone gets to vote if they want to, set the value to 100%.`,
  },
  {
    paramName: 'stakePeriod',
    complementaryLabel: 'hours',
    title: 'Staking Phase Duration',
    defaultValue: 120,
    maxValue: 8760,
    description:
      'At what threshold of reputation having voted should the voting period to end?',
    accordionItemDescription: `If the staking phase is 72 hours, then once a motion is created members will have 72 hours to provide the full stake required to back the motion. If the motion does not receive the full stake in 72 hours, it will fail. Once the motion has been fully staked, the staking period will reset and members will have a further 72 hours in which to “Object” by staking against the motion if they wish to take the decision to a vote. If the full stake for the objection is not staked, then the motion will automatically pass.`,
  },
  {
    paramName: 'submitPeriod',
    complementaryLabel: 'hours',
    title: 'Voting Phase Duration',
    defaultValue: 120,
    maxValue: 8760,
    description:
      'How long do you want to allow each side of a motion to get staked?',
    accordionItemDescription: `If the vote duration is 72 hours, then after both sides of the motion are fully staked, members with reputation in the team will have 72 hours in which to vote, unless the “End Vote Threshold” is reached, in which case the vote will end early.`,
  },
  {
    paramName: 'revealPeriod',
    complementaryLabel: 'hours',
    title: 'Reveal Phase Duration',
    defaultValue: 72,
    maxValue: 8760,
    description: 'How long do you want to give members to cast their votes?',
    accordionItemDescription: `Votes in colony are secret while the vote is ongoing, and so must be revealed once votes have been cast. If the reveal phase is 72 hours long, then members will have 72 hours to reveal their votes, otherwise their votes will not be counted and they will not receive a share of the voter reward. If all votes are revealed before the end of the reveal phase, then the reveal phase will end.`,
  },
  {
    paramName: 'escalationPeriod',
    complementaryLabel: 'hours',
    title: 'Escalation Phase Duration',
    defaultValue: 72,
    maxValue: 8760,
    description:
      'How long do you wish to allow for members to escalate a dispute to a higher team?',
    accordionItemDescription: `If the escalation phase is 72 hours, once the outcome of a vote is known, if the loser feels the outcome was for any reason incorrect, then they will have 72 hours in which to escalate the dispute to a higher team in the colony by increasing the stake to meet the required stake of that higher team.`,
  },
];

export const extensionContentTestingGovernance: AccordionContent[] = [
  {
    paramName: 'totalStakeFraction',
    complementaryLabel: 'percent',
    title: 'Required Stake',
    defaultValue: 1,
    maxValue: 50,
    description:
      'What percentage of the team’s reputation, in token terms, should need to stake on each side of a motion?',
    accordionItemDescription: `If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to be staked to either support or object to a motion.`,
  },
  {
    paramName: 'voterRewardFraction',
    complementaryLabel: 'percent',
    title: 'Voter Reward',
    defaultValue: 1,
    maxValue: 50,
    description:
      'In a dispute, what percentage of the losing side’s stake should be awarded to the voters?',
    accordionItemDescription: `If both the colony members who create a motion, and the colony members who raise an objection stake 50 tokens, and the Voter Reward is 20%, then the voters will share 20 tokens between them, proportional to their reputations (i.e. 20% of the combined stake of both side of the dispute). The remainder will be shared between the stakers proportional to the outcome of the vote.`,
  },
  {
    paramName: 'userMinStakeFraction',
    complementaryLabel: 'percent',
    title: 'Minimum Stake',
    defaultValue: 1,
    maxValue: 100,
    description: `If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to be staked to either support or object to a motion.`,
    accordionItemDescription:
      '10% means anybody who wishes to stake must provide at least 10% of the Required Stake.',
  },
  {
    paramName: 'maxVoteFraction',
    complementaryLabel: 'percent',
    title: 'End Vote Threshold',
    defaultValue: 51,
    maxValue: 100,
    description:
      'What is the minimum percentage of the total stake that each staker should have to provide?',
    accordionItemDescription: `If the End Vote Threshold is 70%, then the voting period will end as soon as 70% of the reputation in a team has cast their vote. This helps votes get settled faster. If you want to ensure everyone gets to vote if they want to, set the value to 100%.`,
  },
  {
    paramName: 'stakePeriod',
    complementaryLabel: 'hours',
    title: 'Staking Phase Duration',
    defaultValue: 0.083,
    maxValue: 8760,
    description:
      'At what threshold of reputation having voted should the voting period to end?',
    accordionItemDescription: `If the staking phase is 72 hours, then once a motion is created members will have 72 hours to provide the full stake required to back the motion. If the motion does not receive the full stake in 72 hours, it will fail. Once the motion has been fully staked, the staking period will reset and members will have a further 72 hours in which to “Object” by staking against the motion if they wish to take the decision to a vote. If the full stake for the objection is not staked, then the motion will automatically pass.`,
  },
  {
    paramName: 'submitPeriod',
    complementaryLabel: 'hours',
    title: 'Voting Phase Duration',
    defaultValue: 0.083,
    maxValue: 8760,
    description:
      'How long do you want to allow each side of a motion to get staked?',
    accordionItemDescription: `If the vote duration is 72 hours, then after both sides of the motion are fully staked, members with reputation in the team will have 72 hours in which to vote, unless the “End Vote Threshold” is reached, in which case the vote will end early.`,
  },
  {
    paramName: 'revealPeriod',
    complementaryLabel: 'hours',
    title: 'Reveal Phase Duration',
    defaultValue: 0.083,
    maxValue: 8760,
    description: 'How long do you want to give members to cast their votes?',
    accordionItemDescription: `Votes in colony are secret while the vote is ongoing, and so must be revealed once votes have been cast. If the reveal phase is 72 hours long, then members will have 72 hours to reveal their votes, otherwise their votes will not be counted and they will not receive a share of the voter reward. If all votes are revealed before the end of the reveal phase, then the reveal phase will end.`,
  },
  {
    paramName: 'escalationPeriod',
    complementaryLabel: 'hours',
    title: 'Escalation Phase Duration',
    defaultValue: 0.083,
    maxValue: 8760,
    description:
      'How long do you wish to allow for members to escalate a dispute to a higher team?',
    accordionItemDescription: `If the escalation phase is 72 hours, once the outcome of a vote is known, if the loser feels the outcome was for any reason incorrect, then they will have 72 hours in which to escalate the dispute to a higher team in the colony by increasing the stake to meet the required stake of that higher team.`,
  },
];
