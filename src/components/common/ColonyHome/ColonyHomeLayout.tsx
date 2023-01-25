import React, { ReactNode } from 'react';

import NewActionButton from '~common/NewActionButton';
import ColonyTotalFunds from '~common/ColonyTotalFunds';
import { useColonyContext } from '~hooks';

import ColonyDomainSelector from './ColonyDomainSelector';
import ColonyFundingWidget from './ColonyFundingWidget';
// import ColonyUnclaimedTransfers from './ColonyUnclaimedTransfers';
import ColonyTitle from './ColonyTitle';
import ColonyNavigation from './ColonyNavigation';
import ColonyMembersWidget from './ColonyMembersWidget';
// import ColonyExtensions from './ColonyExtensions';
import ColonyDomainDescription from './ColonyDomainDescription';
// import ColonyUpgrade from './ColonyUpgrade';
// import ExtensionUpgrade from './ExtensionUpgrade';

import styles from './ColonyHomeLayout.css';

type Props = {
  filteredDomainId: number;
  onDomainChange?: (domainId: number) => void;
  /*
   * This component should only be used with a child to render,
   * otherwise it has no point
   */
  children: ReactNode;
  showControls?: boolean;
  showNavigation?: boolean;
  showSidebar?: boolean;
  showActions?: boolean;
};

const displayName = 'common.ColonyHome.ColonyHomeLayout';

const ColonyHomeLayout = ({
  filteredDomainId,
  children,
  showControls = true,
  showNavigation = true,
  showSidebar = true,
  showActions = true,
  onDomainChange = () => null,
}: Props) => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  return (
    <div className={styles.main}>
      <div
        className={showSidebar ? styles.mainContentGrid : styles.minimalGrid}
      >
        <aside className={styles.leftAside}>
          <ColonyTitle />
          {showNavigation && <ColonyNavigation />}
        </aside>
        <div className={styles.mainContent}>
          {showControls && (
            <>
              <ColonyTotalFunds />
              <div className={styles.contentActionsPanel}>
                <div className={styles.domainsDropdownContainer}>
                  <ColonyDomainSelector
                    filteredDomainId={filteredDomainId}
                    onDomainChange={onDomainChange}
                  />
                </div>
                {showActions && (
                  <NewActionButton filteredDomainId={filteredDomainId} />
                )}
              </div>
            </>
          )}
          {children}
        </div>
        {showSidebar && (
          <aside className={styles.rightAside}>
            <ColonyDomainDescription currentDomainId={filteredDomainId} />
            {/* <ColonyUnclaimedTransfers /> */}
            <ColonyFundingWidget
            // currentDomainId={filteredDomainId}
            />
            <ColonyMembersWidget currentDomainId={filteredDomainId} />
            {/* <ColonyExtensions /> */}
          </aside>
        )}
      </div>
      {/* <ColonyUpgrade colony={colony} />
      <ExtensionUpgrade colony={colony} /> */}
    </div>
  );
};

ColonyHomeLayout.displayName = displayName;

export default ColonyHomeLayout;
