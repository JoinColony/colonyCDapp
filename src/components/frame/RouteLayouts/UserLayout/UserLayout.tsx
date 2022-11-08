import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { RouteComponentProps } from '~frame/RouteLayouts';
import SubscribedColoniesList from '~frame/SubscribedColoniesList';

import UserNavigation from '../UserNavigation';
import SimpleNav from '../SimpleNav';

import query from '~styles/queries.css';
import styles from './UserLayout.css';
import navStyles from '../SimpleNav/SimpleNav.css';

interface Props {
  routeProps?: RouteComponentProps;
  children: React.ReactNode;
}

const displayName = 'frames.RouteLayouts.UserLayout';

const UserLayout = ({
  children,
  routeProps: { hasSubscribedColonies = true } = {},
}: Props) => {
  const isMobile = useMediaQuery({ query: query.query700 });

  return (
    <SimpleNav>
      {isMobile && (
        <div className={styles.head}>
          <div className={navStyles.nav}>
            <UserNavigation />
          </div>
          {hasSubscribedColonies && (
            <div className={styles.coloniesList}>
              <SubscribedColoniesList />
            </div>
          )}
        </div>
      )}
      {children}
    </SimpleNav>
  );
};

UserLayout.displayName = displayName;

export default UserLayout;
