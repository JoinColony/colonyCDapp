import React from 'react';

import { RouteComponentProps } from '~frame/RouteLayouts';
import SubscribedColoniesList from '~frame/SubscribedColoniesList';
import { useMobile } from '~hooks';

import SimpleNav from '../SimpleNav';
import UserNavigation from '../UserNavigation';

import navStyles from '../SimpleNav/SimpleNav.css';
import styles from './UserLayout.css';

interface Props {
  routeProps?: RouteComponentProps;
  children: React.ReactNode;
}

const displayName = 'frame.RouteLayouts.UserLayout';

const UserLayout = ({
  children,
  routeProps: { hasSubscribedColonies = true } = {},
}: Props) => {
  const isMobile = useMobile();

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
