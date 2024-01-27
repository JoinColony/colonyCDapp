import clsx from 'clsx';
import React from 'react';

import MenuContainer from '../MenuContainer/index.ts';

import { MenuWithSectionsProps } from './types.ts';

const displayName = 'v5.shared.MenuWithSections';

const MenuWithSections: React.FC<MenuWithSectionsProps> = ({
  sections,
  footer,
  footerClassName,
}) =>
  sections.length ? (
    <MenuContainer className="w-full overflow-hidden" withPadding={false}>
      {sections.map(({ key, content, className }) => (
        <div
          key={key}
          className={clsx(
            className,
            'border-b border-gray-200 last:border-b-0 px-[1.125rem] py-3',
          )}
        >
          {content}
        </div>
      ))}
      {footer && (
        <div className={clsx(footerClassName, 'px-[1.125rem] py-3')}>
          {footer}
        </div>
      )}
    </MenuContainer>
  ) : null;

MenuWithSections.displayName = displayName;

export default MenuWithSections;
