import React, { FC, useState } from 'react';
import { useMobile, useSideNavigation } from '~hooks';
import NavItem from './partials/NavItem';
import Select from '~shared/Extensions/Select';

const displayName = 'common.Extensions.Navigation';

const Navigation: FC = () => {
  const isMobile = useMobile();

  const [selectedElement, setSelectedElement] = useState(0);

  const handleChange = (selectedOption: number) => {
    setSelectedElement(selectedOption);
  };

  const navigationItems = useSideNavigation();

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
