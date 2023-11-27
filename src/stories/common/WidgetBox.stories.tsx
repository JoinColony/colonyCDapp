import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import WidgetBox from '~v5/common/WidgetBox';
import UserAvatars from '~v5/shared/UserAvatars';

const widgetBoxMeta: Meta<typeof WidgetBox> = {
  title: 'Common/Widget Box',
  component: WidgetBox,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[25.875rem] w-full">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: {
      name: 'Title',
      control: {
        type: 'text',
      },
    },
    value: {
      name: 'Value',
      control: {
        type: 'text',
      },
    },
    additionalContent: {
      name: 'Additional Content',
      control: {
        type: 'text',
      },
    },
    href: {
      name: 'Href',
      control: {
        type: 'text',
      },
    },
  },
};

export default widgetBoxMeta;

export const Base: StoryObj<typeof WidgetBox> = {
  args: {
    title: 'Active actions',
    value: <h4 className="heading-4">42</h4>,
    href: '/',
  },
};

export const WithLightBackground: StoryObj<typeof WidgetBox> = {
  args: {
    title: 'Members',
    value: <h4 className="heading-4">10,876</h4>,
    className: 'bg-base-bg border-base-bg text-gray-900',
    href: '/',
  },
};

export const WithAdditionalContent: StoryObj<typeof WidgetBox> = {
  args: {
    title: 'Total funds',
    value: (
      <div className="flex items-center gap-2">
        <h4 className="heading-4">$25,779,00</h4>
        <span className="text-1">USD</span>
      </div>
    ),
    additionalContent: (
      <UserAvatars
        items={[
          {
            walletAddress: '0xD8Bb3F612902EaF1c858e5663d36081DDbD80C79',
          },
          {
            walletAddress: '0x37842D3196cDA643252B125def5D89a78C03b5b7',
          },
          {
            walletAddress: '0x7fDab0917F1E0A283afce9d9044F57dd15A9A9F5',
          },
        ]}
      />
    ),
    className: 'bg-base-bg border-base-bg text-gray-900',
    href: '/',
  },
};
