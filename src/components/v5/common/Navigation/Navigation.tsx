import clsx from 'clsx';
import React, { FC, useState } from 'react';

import { useMobile } from '~hooks';
import useCurrentPage from '~hooks/useCurrentPage';
import Select from '~v5/common/Fields/Select';

import NavItem from './partials/NavItem';
import { NavigationProps } from './types';

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
