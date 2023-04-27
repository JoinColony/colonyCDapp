import type { Meta, StoryObj } from '@storybook/react';
import SpecificSidePanel from '~common/Extensions/SpecificSidePanel';
import { sidePanelData } from '~common/Extensions/SpecificSidePanel/consts';

const meta: Meta<typeof SpecificSidePanel> = {
  title: 'Common/Specific Side Panel',
  component: SpecificSidePanel,
};

export default meta;
type Story = StoryObj<typeof SpecificSidePanel>;

export const Base: Story = {
  args: {
    statuses: ['enabled'],
    sidePanelData,
  },
};

export const DisabledDeprecated: Story = {
  args: {
    statuses: ['disabled', 'deprecated'],
    sidePanelData,
  },
};

export const NotInstalled: Story = {
  args: {
    statuses: ['not-installed'],
    sidePanelData,
  },
};
