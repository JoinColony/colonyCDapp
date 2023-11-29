import React from 'react';
import clsx from 'clsx';
import MenuContainer from '../MenuContainer';
import { MenuWithSectionsProps } from './types';

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
            'border-b border-gray-200 last:border-b-0 p-[1.125rem]',
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
