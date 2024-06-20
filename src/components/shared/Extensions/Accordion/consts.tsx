import React from 'react';

import SpecialHourInput from '../ConnectForm/partials/SpecialHourInput.tsx';
import SpecialPercentageInput from '../ConnectForm/partials/SpecialPercentageInput.tsx';

import ContentTypeText from './partials/ContentTypeText.tsx';

/*
 * @TODO: display data from API, update components
 */

export const accordionMocksContent = [
  {
    id: 'step-0',
    title: { id: 'show.extension.parameters' },
    content: [
      {
        id: 0,
        textItem: (
          <ContentTypeText
            title="Required Stake"
            subTitle="What percentage of the team's reputation,
            in token terms, should need to stake on each side of a motion?"
          />
        ),
        inputItem: <SpecialHourInput name="requiredStake" />,
      },
    ],
  },
  {
    id: 'step-1',
    title: { id: 'show.extension.parameters' },
    content: [
      {
        id: 1,
        textItem: (
          <ContentTypeText
            title="Voter Reward"
            subTitle="In a dispute, what percentage of the losing side's stake should be awarded to the voters?"
          />
        ),
        inputItem: <SpecialPercentageInput name="voterReward" />,
        accordionItem: [
          {
            id: 'step-1-0',
            header: 'Example scenario 1',
            content: 'content 1',
          },
          {
            id: 'step-1-1',
            header: 'Example scenario 2',
            content: 'content 2',
          },
          {
            id: 'step-1-2',
            header: 'Example scenario 3',
            content: 'content 3',
          },
        ],
      },
    ],
  },
  {
    id: 'step-2',
    title: { id: 'show.extension.parameters' },
    content: [
      {
        id: 1,
        textItem: (
          <ContentTypeText
            title="Voter Reward"
            subTitle="In a dispute, what percentage of the losing side's stake should be awarded to the voters?"
          />
        ),
        inputItem: <SpecialPercentageInput name="voterReward2" />,
      },
      {
        id: 2,
        textItem: (
          <ContentTypeText
            title="Minimum Stake"
            subTitle="Minimum percentage of the total stake that each staker should have to provide"
          />
        ),
        accordionItem: [
          {
            id: 'step-2-0',
            header: 'Example scenario',
            content: `If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to be staked to either support or object to a motion.`,
          },
        ],
      },
      {
        id: 3,
        textItem: (
          <ContentTypeText
            title="End Vote Threshold"
            subTitle="At what threshold of reputation having voted should the voting period to end?"
          />
        ),
        accordionItem: [
          {
            id: 'step-3-0',
            header: 'Example scenario',
            content: `If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to be staked to either support or object to a motion.`,
          },
          {
            id: 'step-3-1',
            header: 'Example scenario 2',
            content: `If a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to be staked to either support or object to a motion.`,
          },
        ],
      },
    ],
  },
];
