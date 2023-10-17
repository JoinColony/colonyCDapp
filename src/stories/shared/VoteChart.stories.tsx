import type { Meta, StoryObj } from '@storybook/react';
import VoteChart from '~v5/shared/VoteChart';

const voteChartMeta: Meta<typeof VoteChart> = {
  title: 'Shared/Vote Chart',
  component: VoteChart,
  argTypes: {
    percentageVotesFor: {
      name: 'Percentage of votes for',
      control: {
        type: 'number',
        min: 1,
        max: 100,
      },
    },
    predictPercentageVotesFor: {
      name: 'Predicted percentage of votes for',
      control: {
        type: 'number',
        min: 1,
        max: 100,
      },
    },
    forLabel: {
      name: 'Label for votes for',
      control: {
        type: 'text',
      },
    },
    percentageVotesAgainst: {
      name: 'Percentage of votes against',
      control: {
        type: 'number',
        min: 1,
        max: 100,
      },
    },
    predictPercentageVotesAgainst: {
      name: 'Predicted percentage of votes against',
      control: {
        type: 'number',
        min: 1,
        max: 100,
      },
    },
    againstLabel: {
      name: 'Label for votes against',
      control: {
        type: 'text',
      },
    },
    threshold: {
      name: 'Threshold',
      control: {
        type: 'number',
        min: 1,
        max: 100,
      },
    },
    thresholdLabel: {
      name: 'Label for threshold',
      control: {
        type: 'text',
      },
    },
  },
  args: {
    percentageVotesFor: 50,
    percentageVotesAgainst: 50,
    threshold: 10,
    forLabel: 'Supported',
    againstLabel: 'Opposed',
  },
};

export default voteChartMeta;

export const Base: StoryObj<typeof VoteChart> = {};

export const WithPredictionFor: StoryObj<typeof VoteChart> = {
  args: {
    predictPercentageVotesFor: 70,
  },
};

export const WithPredictionAgainst: StoryObj<typeof VoteChart> = {
  args: {
    predictPercentageVotesAgainst: 70,
  },
};
