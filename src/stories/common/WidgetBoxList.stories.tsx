import React from 'react';

import WidgetBoxList from '~v5/common/WidgetBoxList';
import UserAvatars from '~v5/shared/UserAvatars';

import type { Meta, StoryObj } from '@storybook/react';

const widgetBoxListMeta: Meta<typeof WidgetBoxList> = {
  title: 'Common/Widget Box List',
  component: WidgetBoxList,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="w-full">
        <Story />
      </div>
    ),
  ],
};

export default widgetBoxListMeta;

export const Base: StoryObj<typeof WidgetBoxList> = {
  args: {
    items: [
      {
        key: '1',
        title: 'Active actions',
        value: <h4 className="heading-4">42</h4>,
        className:
          'bg-teams-purple-400 border-teams-purple-400 text-base-white',
        href: '/',
      },
      {
        key: '2',
        title: 'Members',
        value: <h4 className="heading-4">10,876</h4>,
        className: 'bg-base-bg border-base-bg text-gray-900',
        href: '/',
      },
      {
        key: '3',
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
    ],
  },
};
