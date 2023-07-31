import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import ColonyTotalFunds from '~common/ColonyTotalFunds';
import { useColonyContext } from '~hooks';

import ActionsPanel from './ActionsPanel';

import ColonyHomeInfo from '../ColonyHomeInfo';
import ColonyDomainDescription from '../ColonyDomainDescription';
import ColonyExtensions from '../ColonyExtensionsWidget';
import ColonyFundingWidget from '../ColonyFundingWidget';
import ColonyMembersWidget from '../ColonyMembersWidget';
import ColonyUnclaimedTransfers from '../ColonyUnclaimedTransfers';
import ColonyUpgrade from '../ColonyUpgrade';
import OneTxPaymentUpgrade from '../OneTxPaymentUpgrade';

import styles from './ColonyHomeLayout.css';

const isExtensionsRoute = (pathname: string) => {
  return pathname.includes('extensions');
};

export type ColonyHomeLayoutProps = {
  filteredDomainId: number;
  onDomainChange?: (domainId: number) => void;
  /*
   * This component should only be used with a child to render,
   * otherwise it has no point
   */
  children: ReactNode;
};

const displayName = 'common.ColonyHome.ColonyHomeLayout';

const ColonyHomeLayout = ({
  children,
  filteredDomainId,
  onDomainChange = () => null,
}: ColonyHomeLayoutProps) => {
  const { colony } = useColonyContext();
  const { pathname } = useLocation();

  if (!colony) {
    return null;
  }

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
              <ActionsPanel
                onDomainChange={onDomainChange}
                filteredDomainId={filteredDomainId}
              />
            </>
          )}
          {children}
        </div>
        {!isExtensions && (
          <aside className={styles.rightAside}>
            <ColonyDomainDescription currentDomainId={filteredDomainId} />
            <ColonyUnclaimedTransfers />
            <ColonyFundingWidget currentDomainId={filteredDomainId} />
            <ColonyMembersWidget currentDomainId={filteredDomainId} />
            <ColonyExtensions />
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
