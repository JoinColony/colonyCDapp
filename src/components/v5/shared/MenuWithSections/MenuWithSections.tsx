import clsx from 'clsx';
import React from 'react';

import MenuContainer from '../MenuContainer/index.ts';

import { type MenuWithSectionsProps } from './types.ts';

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
            'border-b border-gray-200 p-[1.125rem] last:border-b-0',
            className,
          )}
        >
          {content}
        </div>
      ))}
      {footer && (
        <div className={clsx(footerClassName, 'p-[1.125rem]')}>{footer}</div>
      )}
    </MenuContainer>
  ) : null;

MenuWithSections.displayName = displayName;

export default MenuWithSections;
