import type { Meta, StoryObj } from '@storybook/react';
import RadioList from '~shared/Extensions/Fields/RadioList';
import { radioItems } from '~shared/Extensions/Fields/RadioList/consts';

const meta: Meta<typeof RadioList> = {
  title: 'Shared/Fields/Radio List',
  component: RadioList,
  args: {
    items: radioItems,
  },
};

export default meta;
type Story = StoryObj<typeof RadioList>;

export const Base: Story = {};
