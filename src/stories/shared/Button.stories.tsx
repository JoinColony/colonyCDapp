import {
  CaretDown,
  CopySimple,
  ShareNetwork,
  Trash,
  User,
} from '@phosphor-icons/react';
import { type Meta, type StoryObj } from '@storybook/react';

import Button from '~v5/shared/Button/index.ts';

const meta: Meta<typeof Button> = {
  title: 'Shared/Buttons/Button',
  component: Button,
  argTypes: {
    mode: {
      name: 'Mode',
      table: {
        disable: true,
      },
    },
    size: {
      name: 'Size',
      options: ['default', 'extraSmall', 'small'],
      control: {
        type: 'select',
      },
    },
    text: {
      name: 'Text',
      control: {
        type: 'text',
      },
    },
    disabled: {
      name: 'Disabled',
      control: {
        type: 'boolean',
      },
    },
    isFullSize: {
      name: 'Is full size?',
      control: {
        type: 'boolean',
      },
    },
    isFullRounded: {
      name: 'Is full rounded?',
      control: {
        type: 'boolean',
      },
    },
    icon: {
      name: 'Icon',
      control: {
        type: 'object',
      },
    },
    isIconRight: {
      name: 'Is icon right? (works with Icon)',
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    text: 'New action',
    size: 'default',
    disabled: false,
    isFullSize: false,
    isFullRounded: false,
    isIconRight: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const PrimarySolid: Story = {
  args: {
    mode: 'primarySolid',
  },
};

export const PrimaryOutline: Story = {
  args: {
    mode: 'primaryOutline',
  },
};

export const PrimaryOutlineFull: Story = {
  args: {
    mode: 'primaryOutlineFull',
  },
};

export const SecondarySolid: Story = {
  args: {
    mode: 'secondarySolid',
  },
};

export const SecondaryOutline: Story = {
  args: {
    mode: 'secondaryOutline',
  },
};

export const Tertiary: Story = {
  args: {
    mode: 'tertiary',
  },
};

export const Quinary: Story = {
  args: {
    mode: 'quinary',
  },
};

export const Completed: Story = {
  args: {
    mode: 'completed',
    text: 'Address copied',
  },
};

Completed.argTypes = {
  disabled: {
    table: {
      disable: true,
    },
  },
  isIconRight: {
    table: {
      disable: true,
    },
  },
};

export const primaryOutlineFullWithIcon: Story = {
  args: {
    mode: 'primaryOutlineFull',
    icon: CopySimple,
    text: 'Copy address',
  },
};

export const SecondaryOutlineWithIcon: Story = {
  args: {
    mode: 'secondaryOutline',
    icon: Trash,
    text: 'Delete account',
  },
};

export const PrimaryOutlineSmallWithIcon: Story = {
  args: {
    mode: 'primaryOutline',
    icon: ShareNetwork,
    text: 'Button CTA',
    size: 'small',
  },
};

export const PrimarySolidSmallWithIcon: Story = {
  args: {
    mode: 'primarySolid',
    icon: User,
    text: 'Button CTA',
    size: 'small',
  },
};

export const PrimarySolidSmallWithIconRight: Story = {
  args: {
    mode: 'primarySolid',
    icon: CaretDown,
    iconSize: 12,
    text: 'Button CTA',
    size: 'small',
    isIconRight: true,
  },
};
