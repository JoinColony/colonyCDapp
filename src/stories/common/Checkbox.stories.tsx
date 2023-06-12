import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useForm } from 'react-hook-form';

import Checkbox from '~common/Extensions/Checkbox';
import { CheckboxProps } from '~common/Extensions/Checkbox/types';

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
      <Checkbox {...args} register={register} />
    </form>
  );
};

export const Base: Story = {
  render: () => (
    <CheckboxWithHooks id="checkbox-1" name="checkbox-1" label={{ id: 'extensionDetailsPage.uninstallConfirmation' }} />
  ),
};
