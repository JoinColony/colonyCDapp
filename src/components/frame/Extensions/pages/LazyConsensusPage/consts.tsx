import React from 'react';

import { type RadioItemProps } from '~common/Extensions/Fields/RadioList/types.ts';
import ContentTypeText from '~shared/Extensions/Accordion/partials/ContentTypeText.tsx';

import { GovernanceOptions } from '../ExtensionsPage/types.ts';

export const governanceRadioList: RadioItemProps[] = [
  {
    value: GovernanceOptions.SPEED_OVER_SECURITY,
    label: 'Speed over security',
    description: '3-day staking and voting periods, 60% quorum.',
  },
  {
    value: GovernanceOptions.SECURITY_OVER_SPEED,
    label: 'Security over speed',
    description: '5-day staking and voting periods, 80% quorum.',
  },
  {
    value: GovernanceOptions.TESTING_GOVERNANCE,
    label: 'Testing governance',
    description: 'Do everything fast to figure out how things work.',
  },
  {
    value: GovernanceOptions.CUSTOM,
    label: 'Custom (Advanced)',
    description: "I know what I'm doing and want to configure it myself.",
  },
];

export const defaultGovernanceOptions = {
  [GovernanceOptions.CUSTOM]: {
    totalStakeFraction: 1,
    voterRewardFraction: 20,
    userMinStakeFraction: 1,
    maxVoteFraction: 70,
    stakePeriod: 72,
    submitPeriod: 72,
    revealPeriod: 72,
    escalationPeriod: 0,
    // escalationPeriod: 72, @TODO Re-enable once Motion escalation is implemented
  },
  [GovernanceOptions.SPEED_OVER_SECURITY]: {
    totalStakeFraction: 1,
    voterRewardFraction: 20,
    userMinStakeFraction: 1,
    maxVoteFraction: 60,
    stakePeriod: 72,
    submitPeriod: 72,
    revealPeriod: 42,
    escalationPeriod: 0,
    // escalationPeriod: 48, @TODO Re-enable once Motion escalation is implemented
  },
  [GovernanceOptions.SECURITY_OVER_SPEED]: {
    totalStakeFraction: 1,
    voterRewardFraction: 20,
    userMinStakeFraction: 1,
    maxVoteFraction: 80,
    stakePeriod: 120,
    submitPeriod: 120,
    revealPeriod: 72,
    escalationPeriod: 0,
    // escalationPeriod: 72, @TODO Re-enable once Motion escalation is implemented
  },
  [GovernanceOptions.TESTING_GOVERNANCE]: {
    totalStakeFraction: 1,
    voterRewardFraction: 1,
    userMinStakeFraction: 1,
    maxVoteFraction: 51,
    stakePeriod: 0.083,
    submitPeriod: 0.083,
    revealPeriod: 0.083,
    escalationPeriod: 0,
    // escalationPeriod: 0.083, @TODO Re-enable once Motion escalation is implemented
  },
};

export const initialExtensionContent = [
  {
    id: 'step-0',
    title: { id: 'custom.extension.parameters' },
    content: [
      {
        id: 'totalStakeFraction',
        textItem: (
          <ContentTypeText
            title="Required Stake"
            subTitle="What percentage of the team's reputation, in token terms,
                should need to stake on each side of a motion?"
          />
        ),
        inputData: {
          inputType: 'percent',
          name: 'totalStakeFraction',
        },
        accordionItem: [
          {
            id: 'step-0-1',
            header: 'Example scenario',
            content: `If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to be staked to either support or object to a motion.`,
          },
        ],
      },
      {
        id: 'voterRewardFraction',
        textItem: (
          <ContentTypeText
            title="Voter Reward"
            subTitle="In a dispute, what percentage of the losing side's stake should be awarded to the voters?"
          />
        ),
        inputData: {
          inputType: 'percent',
          name: 'voterRewardFraction',
        },
        accordionItem: [
          {
            id: 'step-0-2',
            header: 'Example scenario',
            content: `If both the colony members who create a motion, and the colony members who raise an objection stake 50 tokens, and the Voter Reward is 20%, then the voters will share 20 tokens between them, proportional to their reputations (i.e. 20% of the combined stake of both side of the dispute). The remainder will be shared between the stakers proportional to the outcome of the vote.`,
          },
        ],
      },
      {
        id: 'userMinStakeFraction',
        textItem: (
          <ContentTypeText
            title="Minimum Stake"
            subTitle="What is the minimum percentage of the total stake that each staker should have to provide?"
          />
        ),
        inputData: {
          inputType: 'percent',
          name: 'userMinStakeFraction',
        },
        accordionItem: [
          {
            id: 'step-0-3',
            header: 'Example scenario',
            content:
              '10% means anybody who wishes to stake must provide at least 10% of the Required Stake.',
          },
        ],
      },
      {
        id: 'maxVoteFraction',
        textItem: (
          <ContentTypeText
            title="End Vote Threshold"
            subTitle="At what threshold of reputation having voted should the voting period to end?"
          />
        ),
        inputData: {
          inputType: 'percent',
          name: 'maxVoteFraction',
        },
        accordionItem: [
          {
            id: 'step-0-4',
            header: 'Example scenario',
            content: `If the End Vote Threshold is 70%, then the voting period will end as soon as 70% of the reputation in a team has cast their vote. This helps votes get settled faster. If you want to ensure everyone gets to vote if they want to, set the value to 100%.`,
          },
        ],
      },
      {
        id: 'stakePeriod',
        textItem: (
          <ContentTypeText
            title="Staking Phase Duration"
            subTitle="How long do you want to allow each side of a motion to get staked?"
          />
        ),
        inputData: {
          inputType: 'hours',
          name: 'stakePeriod',
        },
        accordionItem: [
          {
            id: 'step-0-5',
            header: 'Example scenario',
            content: `If the staking phase is 72 hours, then once a motion is created members will have 72 hours to provide the full stake required to back the motion. If the motion does not receive the full stake in 72 hours, it will fail. Once the motion has been fully staked, the staking period will reset and members will have a further 72 hours in which to “Object” by staking against the motion if they wish to take the decision to a vote. If the full stake for the objection is not staked, then the motion will automatically pass.`,
          },
        ],
      },
      {
        id: 'submitPeriod',
        textItem: (
          <ContentTypeText
            title="Voting Phase Duration"
            subTitle="How long do you want to give members to cast their votes?"
          />
        ),
        inputData: {
          inputType: 'hours',
          name: 'submitPeriod',
        },
        accordionItem: [
          {
            id: 'step-0-6',
            header: 'Example scenario',
            content: `If the vote duration is 72 hours, then after both sides of the motion are fully staked, members with reputation in the team will have 72 hours in which to vote, unless the “End Vote Threshold” is reached, in which case the vote will end early.`,
          },
        ],
      },
      {
        id: 'revealPeriod',
        textItem: (
          <ContentTypeText
            title="Reveal Phase Duration"
            subTitle="How long do you want to give members to reveal their votes?"
          />
        ),
        inputData: {
          inputType: 'hours',
          name: 'revealPeriod',
        },
        accordionItem: [
          {
            id: 'step-0-7',
            header: 'Example scenario',
            content: `Votes in colony are secret while the vote is ongoing, and so must be revealed once votes have been cast. If the reveal phase is 72 hours long, then members will have 72 hours to reveal their votes, otherwise their votes will not be counted and they will not receive a share of the voter reward. If all votes are revealed before the end of the reveal phase, then the reveal phase will end.`,
          },
        ],
      },
      /*
       * @TODO Re-enable once Motion escalation is implemented
       */
      // {
      //   id: 'escalationPeriod',
      //   textItem: (
      //     <ContentTypeText
      //       title="Escalation Phase Duration"
      //       subTitle="How long do you wish to allow for members to escalate a dispute to a higher team?"
      //     />
      //   ),
      //   inputData: {
      //     inputType: 'hours',
      //     name: 'escalationPeriod',
      //     min: 0.01,
      //     max: 8760,
      //     step: 0.001,
      //   },
      //   accordionItem: [
      //     {
      //       id: 'step-0-8',
      //       header: 'Example scenario',
      //       content: `If the escalation phase is 72 hours, once the outcome of a vote is known, if the loser feels the outcome was for any reason incorrect, then they will have 72 hours in which to escalate the dispute to a higher team in the colony by increasing the stake to meet the required stake of that higher team.`,
      //     },
      //   ],
      // },
    ],
  },
];
