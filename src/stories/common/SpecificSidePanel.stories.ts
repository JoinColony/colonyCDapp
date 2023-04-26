import type { Meta, StoryObj } from '@storybook/react';
import SpecificSidePanel from '~common/Extensions/SpecificSidePanel';
import { sidepanelData } from '~common/Extensions/SpecificSidePanel/consts';

const meta: Meta<typeof SpecificSidePanel> = {
  title: 'Common/Specific Side Panel',
  component: SpecificSidePanel,
};

export default meta;
type Story = StoryObj<typeof SpecificSidePanel>;

export const Base: Story = {
  args: {
    types: ['enabled'],
    sidepanelData,
  },
};

export const DisabledDeprecated: Story = {
  args: {
    types: ['disabled', 'deprecated'],
    sidepanelData,
  },
};

export const NotInstalled: Story = {
  args: {
    types: ['not-installed'],
    sidepanelData,
  },
};
