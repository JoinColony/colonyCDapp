import clsx from 'clsx';
import React, { type FC, useState } from 'react';

import { useMobile } from '~hooks/index.ts';
import useCurrentPage from '~hooks/useCurrentPage.tsx';
import Select from '~v5/common/Fields/Select/index.ts';

import NavItem from './partials/NavItem/index.ts';
import { type NavigationProps } from './types.ts';

const displayName = 'v5.common.Navigation';

const Navigation: FC<NavigationProps> = ({ className, navigationItems }) => {
  const isMobile = useMobile();
  const navId = useCurrentPage(navigationItems);

  const [selectedElement, setSelectedElement] = useState(navId);

  return (
    <nav role="navigation" className={clsx(className, 'flex flex-col w-full')}>
      {isMobile ? (
        <Select
          options={navigationItems}
          defaultValue={selectedElement}
          value={selectedElement}
          onChange={(value) => setSelectedElement(value)}
        />
      ) : (
        navigationItems.map(({ label, value: itemValue, to }) => (
          <NavItem key={itemValue} label={label} linkTo={to || ''} />
        ))
      )}
    </nav>
  );
};

Navigation.displayName = displayName;

export default Navigation;
