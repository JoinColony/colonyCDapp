import React, { FC, useState } from 'react';
import { useColonyContext, useMobile } from '~hooks';
import NavItem from './partials/NavItem';
import Select from '~shared/Extensions/Select';

const displayName = 'common.Extensions.Navigation';

const Navigation: FC = () => {
  const { colony } = useColonyContext();
  const { name } = colony || {};
  const isMobile = useMobile();

  const [selectedElement, setSelectedElement] = useState(0);

  const handleChange = (selectedOption: number) => {
    setSelectedElement(selectedOption);
  };

  const navigationItems = [
    {
      id: 0,
      linkTo: `/colony/${name}`,
      label: 'Colony Details',
      value: 'colony-details',
    },
    {
      id: 1,
      linkTo: `/colony/${name}/reputation`,
      label: 'Reputation',
      value: 'reputation',
    },
    {
      id: 2,
      linkTo: `/colony/${name}/permissions`,
      label: 'Permissions',
      value: 'permissions',
    },
    {
      id: 3,
      linkTo: `/colony/${name}/extensions`,
      label: 'Extensions',
      value: 'extensions',
    },
    {
      id: 4,
      linkTo: `/colony/${name}/integrations`,
      label: 'Integrations',
      value: 'integrations',
    },
    {
      id: 5,
      linkTo: `/colony/${name}/incorporation`,
      label: 'Incorporation',
      value: 'incorporation',
    },
    {
      id: 6,
      linkTo: `/colony/${name}/advanced`,
      label: 'Advanced',
      value: 'advanced',
    },
  ];

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
