import React from 'react';

import MenuWithSections from '../MenuWithSections/index.ts';
import StatusText from '../StatusText/StatusText.tsx';

import { type MenuWithStatusTextProps } from './types.ts';

const displayName = 'v5.shared.MenuWithStatusText';

const MenuWithStatusText: React.FC<MenuWithStatusTextProps> = ({
  statusTextSectionProps,
  sections,
}) => {
  const { content, ...restStatusTextSectionProps } = statusTextSectionProps;

  const sectionsWithStatusText = [
    {
      key: 'statusTextSection',
      className: 'bg-gray-50 !py-3',
      content: (
        <>
          <StatusText {...restStatusTextSectionProps} />
          {content || null}
        </>
      ),
    },
    ...sections,
  ];

  return <MenuWithSections sections={sectionsWithStatusText} />;
};

MenuWithStatusText.displayName = displayName;

export default MenuWithStatusText;
