import React from 'react';
import { useForm } from 'react-hook-form';

import Checkbox from '~v5/common/Checkbox/index.ts';
import { type CheckboxProps } from '~v5/common/Checkbox/types.ts';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Checkbox> = {
  title: 'Common/Checkbox',
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

const CheckboxWithHooks = (args) => {
  const { register } = useForm<CheckboxProps>({
    mode: 'onChange',
  });

  return (
    <form>
      <Checkbox {...args} register={register} isChecked />
    </form>
  );
};

export const Base: Story = {
  render: () => (
    <CheckboxWithHooks
      id="checkbox-1"
      name="checkbox-1"
      label={{ id: 'extensionPage.uninstallConfirmation' }}
    />
  ),
};
