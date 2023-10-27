import React, { FC, useState } from 'react';

import clsx from 'clsx';
import { useCurrentPage, useMobile } from '~hooks';
import NavItem from './partials/NavItem';
import Select from '~v5/common/Fields/Select';
import { NavigationProps } from './types';

const displayName = 'v5.common.Navigation';

const Navigation: FC<NavigationProps> = ({ className, navigationItems }) => {
  const isMobile = useMobile();
  const navId = useCurrentPage(navigationItems);

  const [selectedElement, setSelectedElement] = useState(navId);

  const handleChange = (selectedOption: number) => {
    setSelectedElement(selectedOption);
  };

  return (
    <nav role="navigation" className={clsx(className, 'flex flex-col w-full')}>
      {isMobile ? (
        <Select
          list={navigationItems}
          selectedElement={selectedElement}
          handleChange={handleChange}
        />
      ) : (
        navigationItems.map((item) => <NavItem key={item.id} {...item} />)
      )}
    </nav>
  );
};

Navigation.displayName = displayName;

export default Navigation;
