import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import ColonyTotalFunds from '~common/ColonyTotalFunds';
import { useColonyContext } from '~hooks';

import ColonyDomainDescription from '../ColonyDomainDescription';
import ColonyExtensionsWidget from '../ColonyExtensionsWidget';
import ColonyFundingWidget from '../ColonyFundingWidget';
import ColonyHomeInfo from '../ColonyHomeInfo';
import ColonyMembersWidget from '../ColonyMembersWidget';
import ColonySafes from '../ColonySafes';
import ColonyUnclaimedTransfers from '../ColonyUnclaimedTransfers';
import ColonyUpgrade from '../ColonyUpgrade';
import OneTxPaymentUpgrade from '../OneTxPaymentUpgrade';

import ActionsPanel from './ActionsPanel';

import styles from './ColonyHomeLayout.css';

const isExtensionsRoute = (pathname: string) => {
  return pathname.includes('extensions');
};

export type ColonyHomeLayoutProps = {
  /*
   * This component should only be used with a child to render,
   * otherwise it has no point
   */
  children: ReactNode;
};

const displayName = 'common.ColonyHome.ColonyHomeLayout';

const ColonyHomeLayout = ({ children }: ColonyHomeLayoutProps) => {
  const { colony } = useColonyContext();
  const { pathname } = useLocation();

  const isExtensions = isExtensionsRoute(pathname);

  return (
    <div className={styles.main}>
      <div
        className={isExtensions ? styles.mainContentGrid : styles.minimalGrid}
      >
        <ColonyHomeInfo />
        <div className={styles.mainContent}>
          {!isExtensions && (
            <>
              <ColonyTotalFunds />
              <ActionsPanel />
            </>
          )}
          {children}
        </div>
        {!isExtensions && (
          <aside className={styles.rightAside}>
            <ColonyDomainDescription />
            <ColonyUnclaimedTransfers />
            <ColonyFundingWidget />
            <ColonySafes colony={colony} />
            <ColonyMembersWidget />
            <ColonyExtensionsWidget />
          </aside>
        )}
      </div>
      <ColonyUpgrade />
      <OneTxPaymentUpgrade />
    </div>
  );
};

ColonyHomeLayout.displayName = displayName;

export default ColonyHomeLayout;
