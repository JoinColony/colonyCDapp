import React, { ReactNode } from 'react';
import { Params, useParams } from 'react-router-dom';

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

const isExtensionsRoute = (params: Params) => {
  return params['*'] === 'extensions';
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

const ColonyHomeLayout = ({
  filteredDomainId,
  children,
  // ethDomainId,
  onDomainChange = () => null,
}: Props) => {
  const { colony } = useColonyContext();
  const params = useParams();

  if (!colony) {
    return null;
  }

  const isExtensions = isExtensionsRoute(params);

  return (
    <div className={styles.main}>
      <div
        className={isExtensions ? styles.mainContentGrid : styles.minimalGrid}
      >
        <aside className={styles.leftAside}>
          <ColonyTitle />
          <ColonyNavigation />
        </aside>
        <div className={styles.mainContent}>
          {!isExtensions && (
            <>
              <ColonyTotalFunds />
              <div className={styles.contentActionsPanel}>
                <div className={styles.domainsDropdownContainer}>
                  <ColonyDomainSelector
                    filteredDomainId={filteredDomainId}
                    onDomainChange={onDomainChange}
                  />
                </div>
                <NewActionButton /* ethDomainId={ethDomainId} */ />
              </div>
            </>
          )}
          {children}
        </div>
        {!isExtensions && (
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
