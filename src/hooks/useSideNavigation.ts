import { useColonyContext } from '~hooks';

const useSideNavigation = () => {
  const { colony } = useColonyContext();
  const { name } = colony || {};

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

  return navigationItems;
};

export default useSideNavigation;
