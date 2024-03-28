import React, { type FC } from 'react';

import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';

import { type StepDetailsBlockProps } from './types.ts';

const StepDetailsBlock: FC<StepDetailsBlockProps> = ({ text, content }) => (
  <MenuWithStatusText
    statusTextSectionProps={{
      status: StatusTypes.Info,
      children: text,
      textClassName: 'text-4 text-gray-900',
      iconAlignment: 'top',
      iconSize: 16,
      iconClassName: 'text-gray-500',
    }}
    sections={[
      {
        key: 'fund',
        content,
        className: '!p-[1.125rem]',
      },
    ]}
  />
);

export default StepDetailsBlock;
