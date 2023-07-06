import type { Meta, StoryObj } from '@storybook/react';

import TeamReputationSummary from '~v5/common/TeamReputationSummary';
import {
  emptyTeamsData,
  teamsData,
  teamsWithSummedUpData,
} from '~v5/common/TeamReputationSummary/consts';

const meta: Meta<typeof TeamReputationSummary> = {
  title: 'Common/Team Reputation Summary',
  component: TeamReputationSummary,
};

export default meta;
type Story = StoryObj<typeof TeamReputationSummary>;

export const Base: Story = {
  args: {
    teams: teamsData,
  },
};

export const WithSummedUp: Story = {
  args: {
    teams: teamsWithSummedUpData,
  },
};

export const Empty: Story = {
  args: {
    teams: emptyTeamsData,
  },
};
