import React from 'react';

import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import StatusText from '~v5/shared/StatusText/StatusText.tsx';

import type { Meta, StoryObj } from '@storybook/react';

const cardWithStatusTextMeta: Meta<typeof MenuWithStatusText> = {
  title: 'Shared/Card/With Status Text',
  component: MenuWithStatusText,
  args: {
    statusText: (
      <StatusText status={StatusTypes.Info}>This is a status text.</StatusText>
    ),
    content: 'This is an additional content.',
    sections: [
      {
        key: '1',
        content: 'Section 1',
      },
      {
        key: '2',
        content: 'Section 2',
      },
    ],
  },
};

export default cardWithStatusTextMeta;

export const Base: StoryObj<typeof MenuWithStatusText> = {};
