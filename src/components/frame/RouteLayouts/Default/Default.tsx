import React, { ReactNode } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { RouteComponentProps } from '~frame/RouteLayouts';
import SubscribedColoniesList from '~frame/SubscribedColoniesList';
import { useMobile } from '~hooks';

import SimpleNav from '../SimpleNav';
import HistoryNavigation from '../HistoryNavigation';
import UserNavigation from '../UserNavigation';

import styles from './Default.css';
import navStyles from '../SimpleNav/SimpleNav.css';

interface Props {
  children: ReactNode;
  routeProps?: RouteComponentProps;
}

const displayName = 'pages.Default';

const Default = ({
  children,
  routeProps: { hasBackLink = true, backRoute, backText, backTextValues, hasSubscribedColonies = true } = {},
}: Props) => {
  const location = useLocation();
  const backLinkExists = hasBackLink === undefined ? location.state && location.state.hasBackLink : hasBackLink;

  const params = useParams();
  const resolvedBackRoute = typeof backRoute === 'function' ? backRoute(params) : backRoute;
  const isMobile = useMobile();

  return (
    <div className={styles.main}>
      <SimpleNav>
        {backLinkExists && !isMobile && (
          <HistoryNavigation
            backRoute={resolvedBackRoute}
            backText={backText}
            backTextValues={backTextValues}
            className={hasSubscribedColonies ? styles.history : styles.onlyHistory}
          />
        )}
        <div className={styles.content}>
          {isMobile ? (
            // Render the UserNavigation and SubscribedColoniesList in shared parent on mobile
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
          ) : (
            <div className={styles.content}>
              {hasSubscribedColonies && (
                <div className={styles.coloniesList}>
                  <SubscribedColoniesList />
                </div>
              )}
            </div>
          )}
          <div className={styles.children}>{children}</div>
        </div>
      </SimpleNav>
    </div>
  );
};

Default.displayName = displayName;

export default Default;
