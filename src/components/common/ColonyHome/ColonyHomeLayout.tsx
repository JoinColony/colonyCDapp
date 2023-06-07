import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import NewActionButton from '~common/NewActionButton';
import ColonyTotalFunds from '~common/ColonyTotalFunds';
import { useColonyContext } from '~hooks';

import ColonyDomainSelector from './ColonyDomainSelector';
import ColonyFundingWidget from './ColonyFundingWidget';
import ColonyUnclaimedTransfers from './ColonyUnclaimedTransfers';
import ColonyMembersWidget from './ColonyMembersWidget';
import ColonyExtensions from './ColonyExtensionsWidget';
import ColonyDomainDescription from './ColonyDomainDescription';
import ColonyUpgrade from './ColonyUpgrade';
import OneTxPaymentUpgrade from './OneTxPaymentUpgrade';
// import ExtensionUpgrade from './ExtensionUpgrade';
import ColonyHomeInfo from './ColonyHomeInfo';

import styles from './ColonyHomeLayout.css';

const isExtensionsRoute = (pathname: string) => {
  return pathname.includes('extensions');
};

type Props = {
  filteredDomainId: number;
  onDomainChange?: (domainId: number) => void;
  /*
   * This component should only be used with a child to render,
   * otherwise it has no point
   */
  children: ReactNode;
};

const displayName = 'common.ColonyHome.ColonyHomeLayout';

const ColonyHomeLayout = ({ filteredDomainId, children, onDomainChange = () => null }: Props) => {
  const { colony } = useColonyContext();
  const { pathname } = useLocation();

  if (!colony) {
    return null;
  }

  const isExtensions = isExtensionsRoute(pathname);

  return (
    <div className={styles.main}>
      <div className={isExtensions ? styles.mainContentGrid : styles.minimalGrid}>
        <ColonyHomeInfo />
        <div className={styles.mainContent}>
          {!isExtensions && (
            <>
              <ColonyTotalFunds />
              <div className={styles.contentActionsPanel}>
                <div className={styles.domainsDropdownContainer}>
                  <ColonyDomainSelector filteredDomainId={filteredDomainId} onDomainChange={onDomainChange} />
                </div>
                <NewActionButton filteredDomainId={filteredDomainId} />
              </div>
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
