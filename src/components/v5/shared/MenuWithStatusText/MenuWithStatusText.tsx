import React from 'react';

import MenuWithSections from '../MenuWithSections/index.ts';

import { type MenuWithStatusTextProps } from './types.ts';

const displayName = 'v5.shared.MenuWithStatusText';

const MenuWithStatusText: React.FC<MenuWithStatusTextProps> = ({
  content,
  statusText,
  sections,
}) => {
  const sectionsWithStatusText = [
    {
      key: 'statusTextSection',
      className: 'bg-gray-50 !py-3',
      content: (
        <>
          {statusText}
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
