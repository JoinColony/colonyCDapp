import React from 'react';
import MenuWithSections from '../MenuWithSections';
import StatusText from '../StatusText/StatusText';
import { MenuWithStatusTextProps } from './types';

const displayName = 'v5.shared.MenuWithStatusText';

const MenuWithStatusText: React.FC<MenuWithStatusTextProps> = ({
  statusTextSectionProps,
  sections,
  footer,
  footerClassName,
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

  return (
    <MenuWithSections
      sections={sectionsWithStatusText}
      footer={footer}
      footerClassName={footerClassName}
    />
  );
};

MenuWithStatusText.displayName = displayName;

export default MenuWithStatusText;
