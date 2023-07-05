import { useColonyContext } from '~hooks';

const useSideNavigation = (pageName: string) => {
  const { colony } = useColonyContext();
  const { name } = colony || {};

  switch (pageName) {
    case 'extensions': {
      return [
        {
          id: 0,
          linkTo: `/colony/${name}/details`,
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
    }
    case 'members': {
      return [
        {
          id: 0,
          linkTo: `/colony/${name}/members`,
          label: 'All members',
          value: 'members',
        },
        {
          id: 1,
          linkTo: `/colony/${name}/contributors`,
          label: 'Contributors',
          value: 'contributors',
        },
        {
          id: 2,
          linkTo: `/colony/${name}/followers`,
          label: 'Followers',
          value: 'followers',
        },
        {
          id: 3,
          linkTo: `/colony/${name}/verified`,
          label: 'Verified',
          value: 'verified',
        },
        {
          id: 4,
          linkTo: `/colony/${name}/teams`,
          label: 'Teams',
          value: 'teams',
        },
      ];
    }
    default: {
      return [];
    }
  }
};

export default useSideNavigation;
