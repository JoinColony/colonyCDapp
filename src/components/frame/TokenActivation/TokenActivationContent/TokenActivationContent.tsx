import React, { useState, Dispatch, SetStateAction } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~shared/Tabs';
import { useAppContext, useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';

import TokensTab, { TokensTabProps } from '../TokensTab';
import StakesTab from '../StakesTab';

import styles from './TokenActivationContent.css';

const displayName = 'frame.TokenActivation.TokenActivationContent';

const MSG = defineMessages({
  yourTokens: {
    id: `${displayName}.yourTokens`,
    defaultMessage: 'Your tokens',
  },
  stakes: {
    id: `${displayName}.stakes`,
    defaultMessage: 'Stakes',
  },
});

interface TokenActivationContentProps extends TokensTabProps {
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;
}

const TokenActivationContent = ({
  setIsPopoverOpen,
  ...otherProps
}: TokenActivationContentProps) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const currentUserClaims = colony?.motionsWithUnclaimedStakes
    ?.filter(notNull)
    .filter(({ unclaimedRewards }) =>
      unclaimedRewards.some(({ address }) => address === user?.walletAddress),
    );

  const claimsCount = currentUserClaims?.length ?? 0;

  return (
    <div className={styles.main}>
      <Tabs
        selectedIndex={tabIndex}
        onSelect={(newIndex) => {
          setTabIndex(newIndex);
        }}
      >
        <TabList
          className={styles.tabsList}
          containerClassName={styles.tabsListContainer}
        >
          <Tab
            selectedClassName={styles.tabSelected}
            className={styles.tab}
            data-test="yourTokensTab"
          >
            <FormattedMessage {...MSG.yourTokens} />
          </Tab>
          <Tab selectedClassName={styles.tabSelected} className={styles.tab}>
            <div className={styles.stakesTabTitle} data-test="stakesTab">
              <FormattedMessage {...MSG.stakes} />
              {claimsCount > 0 && (
                <div className={styles.dot}>
                  <span>{claimsCount}</span>
                </div>
              )}
            </div>
          </Tab>
        </TabList>
        <TabPanel className={styles.tabContainer}>
          <TokensTab {...otherProps} />
        </TabPanel>
        <TabPanel className={styles.tabContainer}>
          <StakesTab
            {...otherProps}
            setIsPopoverOpen={setIsPopoverOpen}
            currentUserClaims={currentUserClaims ?? []}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TokenActivationContent;
