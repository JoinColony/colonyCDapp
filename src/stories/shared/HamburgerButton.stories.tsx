import React, { FC, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import HamburgerButton from '~v5/shared/HamburgerButton';

const hamburgerButtonMeta: Meta<typeof HamburgerButton> = {
  title: 'Shared/Hamburger Button',
  component: HamburgerButton,
  parameters: {
    layout: 'centered',
  },
};

export default hamburgerButtonMeta;

const HamburgerButtonWithHooks: FC<{ label?: string }> = ({ label }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <HamburgerButton
      isOpen={isOpen}
      onClick={() => setIsOpen((prevState) => !prevState)}
      label={label}
    />
  );
};

export const Base: StoryObj<typeof HamburgerButton> = {
  render: ({ label }) => <HamburgerButtonWithHooks label={label} />,
};

export const WithLabel: StoryObj<typeof HamburgerButton> = {
  render: ({ label }) => <HamburgerButtonWithHooks label={label} />,
  args: {
    label: 'Menu',
  },
};
