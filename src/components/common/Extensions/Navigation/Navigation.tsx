import React, { FC, useState } from 'react';

import { useCurrentPage, useMobile, useSideNavigation } from '~hooks';
import NavItem from './partials/NavItem';
import Select from '~shared/Extensions/Select';

const displayName = 'common.Extensions.Navigation';

const Navigation: FC = () => {
  const isMobile = useMobile();
  const navigationItems = useSideNavigation();
  const navId = useCurrentPage(navigationItems);

  const [selectedElement, setSelectedElement] = useState(navId);

  const handleChange = (selectedOption: number) => {
    setSelectedElement(selectedOption);
  };

  return (
    <nav role="navigation" className="flex flex-col w-full">
      {isMobile ? (
        <Select list={navigationItems} selectedElement={selectedElement} handleChange={handleChange} />
      ) : (
        navigationItems.map((item) => <NavItem key={item.id} {...item} />)
      )}
    </nav>
  );
};

Navigation.displayName = displayName;

export default Navigation;
